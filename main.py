#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import json
import random
import jinja2
import os

from google.appengine.ext import db
from google.appengine.api import images

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


class Node(db.Model):
    # essential
    tree_id = db.IntegerProperty()
    node_id = db.IntegerProperty()
    parent_id = db.IntegerProperty()
    graph = db.BlobProperty()
    graph_uri = db.StringProperty()
    title = db.StringProperty()
    description = db.StringProperty()

    # meta data
    flag_is_end = db.BooleanProperty()
    tree_level = db.IntegerProperty()

    # facebook related
    author_id = db.IntegerProperty()
    date = db.DateTimeProperty(auto_now_add=True)
    
    def listAll(self):
        out = {}
        out['tree_id'] = self.tree_id
        out['node_id'] = self.node_id
        out['parent_id'] = self.parent_id
        out['graph_uri'] = self.graph_uri
        out['title'] = self.title
        out['description'] = self.description
        out['flag_is_end'] = self.flag_is_end
        out['tree_level'] = self.tree_level
        out['author_id'] = self.author_id
        out['date'] = str(self.date)
        return out

    def obtainNewID(self):
        new_id = -1
        n = True
        while n:
            new_id = random.getrandbits(32)
            n = Node.all().filter('node_id =', new_id).get()
        return new_id


class MainHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {}
        template = jinja_environment.get_template('top.html')
        self.response.out.write(template.render(template_values))
        

class NodeHandler(webapp2.RequestHandler):
    def get(self):
        nodes = Node.all().fetch(1000)
        self.response.out.write(json.dumps([n.listAll() for n in nodes]))

    def post(self):
        n = Node()

        n.description = self.request.get('description')
        n.title = self.request.get('title')
        n.flag_is_end = self.request.get('flag_is_end') == 'true'
        n.node_id = n.obtainNewID()

        try:
            parent_node = Node.all().filter('node_id =', int(self.request.get('parent_id'))).get() 
        except ValueError:
            n.parent_id = -1
            n.tree_level = 1
            n.tree_id = n.node_id
        else:
            n.parent_id = parent_node.node_id
            n.tree_level = parent_node.tree_level + 1
            n.tree_id = parent_node.tree_id
        
        graph = self.request.get('graph')
        a = images.Image(self.request.get('graph'))
        if a.width > a.height:
            graph = images.crop(graph, 0.5-0.5*a.height/a.width, 0.0, 0.5+0.5*a.height/a.width, 1.0)
        else:
            graph = images.crop(graph, 0.0, 0.5-0.5*a.width/a.height, 1.0, 0.5+0.5*a.width/a.height)
        graph = images.resize(graph, 500, 500)
        n.graph = db.Blob(graph)
        n.put()
        n.graph_uri = '/userimg/' + str(n.key())
        n.put()
        self.redirect('/context?node_id=%d' % n.node_id)


class SingleNodeHandler(webapp2.RequestHandler):
    def get(self, req_node_id):
        n = Node.all().filter('node_id =', int(req_node_id)).get()
        if n:
            self.response.out.write(json.dumps(n.listAll()))
        else:
            self.response.out.write('not found')


class ImageHandler(webapp2.RequestHandler):
    def get(self, image_key):
        n = db.get(image_key)
        if n.graph:
            self.response.headers['Content-Type'] = 'image/png'
            self.response.out.write(n.graph)
        else:
            self.response.out.write('No mage')


class InitHandler(webapp2.RequestHandler):
    def get(self):
        n = Node()
        n.description = 'George'
        n.title = 'Grandpa'
        n.flag_is_end = False
        n.parent_id = -1 #root
        n.graph_uri = 'http://i.imgur.com/CY5vG.jpg'
        n.node_id = 1
        n.tree_level = 1
        n.tree_id = 1
        n.put()
        self.redirect('/')


class ClearHandler(webapp2.RequestHandler):
    def get(self):
        nodes = Node().all().fetch(1000)
        for n in nodes:
            n.delete()
        self.redirect('/')


class ContextHandler(webapp2.RequestHandler):
    def get(self):
        current_node = Node.all().filter('node_id =', int(self.request.get('node_id'))).get()
        output = {}

        # self
        output['self'] = current_node.listAll()

        # siblings
        sibs = Node.all().filter('parent_id =', current_node.parent_id).filter('node_id !=', current_node.node_id).fetch(1000)
        output['siblings'] = [n.listAll() for n in sibs]
        
        # ancestors
        ancs = []
        cur_parent_id = current_node.parent_id
        while True:
            if cur_parent_id == -1:
                break
            cur_parent = Node.all().filter('node_id =', cur_parent_id).get()
            ancs.insert(0, cur_parent.listAll())
            cur_parent_id = cur_parent.parent_id
        output['ancestors'] = ancs

        # children
        chis = Node.all().filter('parent_id =', current_node.node_id).fetch(1000)
        output['children'] = [n.listAll() for n in chis]

        self.response.out.write(json.dumps(output))


class RootHandler(webapp2.RequestHandler):
    def get(self):
        roots = Node.all().filter('parent_id =', -1).order('-date').fetch(1000)
        self.response.out.write(json.dumps([r.listAll() for r in roots]))


class ViewHandler(webapp2.RequestHandler):
    def get(self, req_node_id):
        template_values = {}
        template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render(template_values))
        

class PathHandler(webapp2.RequestHandler):
    def get(self, req_node_id):
        template_values = {}
        template = jinja_environment.get_template('path.html')
        self.response.out.write(template.render(template_values))

app = webapp2.WSGIApplication([('/', MainHandler),
                               ('/nodes', NodeHandler),
                               (r'/node/(\d+)', SingleNodeHandler),
                               (r'/userimg/(.*)', ImageHandler),
                               ('/clear', ClearHandler),
                               ('/context', ContextHandler),
                               ('/roots', RootHandler),
                               (r'/view/(\d+)', ViewHandler),
                               (r'/path/(\d+)', PathHandler)],
                              debug=True)
