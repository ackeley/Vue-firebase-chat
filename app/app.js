
requirejs(['firebase-configs'], function(config){

var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.database();

var chatComponent = Vue.extend({
        template: `
            <style>
                .chat{
                    padding:0;
                }
                .chat li{
                    margin-bottom : 10px;
                    padding-bottom: 10px;            
                }
                .chat li.left .chat-body {
                    
                    margin-left:80px;
                }
                .chat li.right .chat-body {
                    text-align:right;
                    margin-right:100px;
                }
                .panel-body{
                    overflow-y: scroll;
                    height:450px;
                }

            </style>
                    <div class="panel panel-primary">
                        <div class="panel-heading">Chat</div>
                        <div class="panel-body">
                            <ul class="chat list-unstyled">
                            <li class="clearfix" v-bind:class="{left: !isUser(o.email), right:isUser(o.email)}" v-for="o in messages">
                                    <span v-bind:class="{'pull-left': !isUser(o.email), 'pull-right':isUser(o.email)}">
                                        <img v-bind:src="o.photo" class="img-circle" />
                                    </span>
                                    <div class="chat-body">
                                        <strong>{{o.name}}</strong>
                                        <p>
                                           {{ o.text }}
                                        </p>
                                    </div>
                                </li>
                                <!-- <li class="left clearfix">
                                    <span class="pull-left">
                                        <img src="http://placehold.it/50/000fff/fff&text=00" class="img-circle" />
                                    </span>
                                    <div class="chat-body">
                                        <p>
                                            teste do corpo!
                                        </p>
                                    </div>
                                </li>
                                <li class="right clearfix">
                                    <span class="pull-right">
                                        <img src="http://placehold.it/50/ffffff/fff&text=EU" class="img-circle" />
                                    </span>
                                    <div class="chat-body">
                                        <p>
                                            teste do corpo!
                                        </p>
                                    </div>
                                </li> -->
                            </ul>
                        </div>
                        <div class="panel-footer">
                            <div class="input-group">
                                <input type="text" class="form-control input-md" placeholder="Digite a mensagem" v-model="message" @keyup.enter="sendMessage">
                                <span class="input-group-btn">
                                    <button class="btn btn-success btn-md" @click="sendMessage">Enviar </button>
                                </span>
                            </div>
                        </div>
                    </div>               
            `,
            created: function (){
                var roomRef  = 'chat/rooms/' + this.$route.params.room;
                this.$bindAsArray('messages', db.ref(roomRef + '/messages'));               

            },
            data: function(){
                return{
                    user:{
                        email:localStorage.getItem('email'),
                        name:localStorage.getItem('name'),
                        photo:localStorage.getItem('photo')
                    },
                    message:[]
                
                };
            }       ,
            methods: {
                isUser: function(email){
                return this.user.email == email
            },
                sendMessage: function(){
                return this.$firebaseRefs.messages.push({
                    name:this.user.name,
                    email: this.user.email,
                    text: this.message,
                    photo: this.user.photo
                });    
                this.message = ''
            }
        }
    });       

    var roomsComponent = Vue.extend({
        template: `
            <div class="col-md-4" v-for="o in rooms">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        {{o.name}}
                    </div>
                    <div class="panel-body">
                        {{o.description}}
                        <br>
                        <a href="javascript:void(0)" @click="openModal(o)">Entrar</a>
                    </div>
                </div>
            </div>   
            <div class="modal fade" id="modalLoginEmail" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Entre com as Informações</h4>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <input type="text" name="email" class="form-control" v-model="email" placeholder="E-mail">
                                </div>
                                <div class="form-group">
                                    <input type="text" name="name" class="form-control" v-model="name" placeholder="Nome">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-primary" @click="login">Entrar :)</button>
                        </div>
                    </div>
                </div>
            </div>               
        `,
        firebase: {
            rooms: db.ref('chat/rooms')
        },
        data: function(){
            return{
                rooms: [
                    {id:"001", name:"PHP", description:"Discutir a respeito PHP"},
                    {id:"002", name:"Delphi", description:"Discutir a respeito Delphi"},
                    {id:"003", name:"Vue", description:" Discutir a respeito Vue"},
                    {id:"004", name:"Html", description:"Discutir a respeito de HTML"},
                    {id:"005", name:"Html", description:"Discutir a respeito de HTML"},
                    {id:"006", name:"Html", description:"Discutir a respeito de HTML"}
                ],
            
                name: '',
                email: '',
                room: null
            }
        },
        methods:{
            login: function(){
                localStorage.setItem('name', this.name);
                localStorage.setItem('email', this.email);
                localStorage.setItem('user.photo', "http://www.gravatar.com/avatar/"+md5(this.email)+".jpg");
                
                $('#modalLoginEmail').modal('hide');
                
                this.$route.router.go('/chat/' + this.room.id);
            },
            openModal: function(room){
                this.room = room;
                $('#modalLoginEmail').modal('show');
            }
            // insertData : function(){
            //     this.$firebaseRefs.array.push({
            //         text: this.text
            //     });
            // }
        }
    });

    var rooms = [
                    {id:"001", name:"PHP", description:"Discutir a respeito PHP"},
                    {id:"002", name:"Delphi", description:"Discutir a respeito Delphi"},
                    {id:"003", name:"Vue", description:" Discutir a respeito Vue"},
                    {id:"004", name:"Html", description:"Discutir a respeito de HTML"},
                    {id:"005", name:"Html", description:"Discutir a respeito de HTML"},
                    {id:"006", name:"Html", description:"Discutir a respeito de HTML"}
                ];

    var roomsCreateComponent = Vue.extend({
        template:
        ` 
        <ul>
            <li v-for="o in rooms">
                {{o.name}}
            </li>
        </ul>

        `,
        firebase: {
            rooms: db.ref('chat/rooms')
        },
        ready: function() {
            var chatRef = db.ref('chat')
            var roomsChildren = chatRef.child('rooms')

            rooms.forEach(function(room){
                roomsChildren.child(room.id).set({
                    name:room.name,
                    description : room.description
                });
            })
        }
    });

    var appComponent = Vue.extend({})

    // Vue.component('my-chat', chatComponent);

    // var chat = new Vue({
    //     el:"#chat",             
    // });


    var router = new VueRouter();

    router.map({
        '/chat/:room': {
            component: chatComponent
        },
        '/rooms':{
            component: roomsComponent
        },
        '/rooms-create':{
            component: roomsCreateComponent
        }
    });

    router.start(appComponent, "#app");
});
