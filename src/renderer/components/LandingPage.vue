<template>
	<div id="wrapper">
<!-- 		<div class="linerow">
			<img  id="logo"  src="~@/assets/electronlogo.png" alt="electron-vue">
			<h1>Electron App</h1>
		</div> -->
		<!-- <hr/><br/> -->
		<main>
			<div class="container">
				<div class="linerow" @click="open('https://developers.line.me/en/docs/enterprise/business-connect/reference/#sending_message')" style="cursor:pointer">
					<img class="lineimg" src="~@/assets/line-notify.png" alt="electron-vue">
          			<h2>Line Notify at  GroupName: {{gname}}</h2>
				</div>
				<div class="row">
          		<input type="button" value="Create you token" @click="open('https://notify-bot.line.me/my/')" />
          		<input type="button" value="Add New token" @click="changetoken" />
          		<input type="button" value="Del current token" @click="deltoken" />
          		<select name="tokens" refs="tokens" @change="selectedtoken">
          			<option v-for="(tok,idx) in tokens" :key="idx" :value="tok.token">{{tok.name}}</option>
          		</select>
					<div class="form-group">
						<label class="col-sm-2 control-label">Line Message (max1000) :</label>
						<div class="col-sm-10">
							<textarea name="message" v-model="message" class="form-control" style="width:90%" required="required" rows="4" cols="50">

							</textarea><br/>
							chars: {{countmsg}}/1000
						</div>
					</div>
				</div <div class="row">
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
						<div class="form-group">
							<label class="col-sm-2 control-label">Sticker Package Id</label>
							<div class="col-sm-10">
								<input type="number" v-model="stkpkid" name="stickerpackage" class="form-control" value="0" min="0" max="4" step="1" required="required">
							</div>
						</div>
					</div>
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 ">
						<div class="form-group ">
							<label class="col-sm-2 control-label">Sticker ID</label>
							<div class="col-sm-10 ">
								<input type="number" @change="stkchange" v-model="stkid" name="sticker" id="stkid"  class="form-control" value="0" v-bind:min="minid" v-bind:max="maxid" step="1" />
							</div>
						</div>
					</div>
					<div class="row">

						<div v-if="!image">
							<div class="form-group">
								<label class="col-sm-2 control-label">Image File</label>
								<div class="col-sm-10">
									<input type="file" accept="image/*" ref="localfile" @change="onFileChange" name="image" class="form-control" />
								</div>
							</div>
						</div>
						<div v-else>
							<img style="width:200px;height:auto;" :src="image" />
							<button @click="removeImage">Remove image</button>
						</div>
					</div>
					<div style="display:flex">
						<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8" style="width: 70%;">
							&nbsp;
						</div>
						<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
							<input type="button" @click="linemsg" value="Send>>" />
						</div>
					</div>

					<br/><hr/>

					<div class="row">

						<div class="form-group">
							<label class="col-sm-2 control-label">Status:</label>
							<div class="col-sm-10">
								<textarea name="message" v-model="status" class="form-control" style="width:90%" required="required" rows="4" cols="50">

								</textarea>
							</div>
						</div>
					</div>
					<button class="alt" @click="open('https://devdocs.line.me/files/sticker_list.pdf')">Sticker List</button>
					<button class="alt" @click="linestatus">Validate Line Token</button>
					<button class="alt" @click="lineimport">import</button>
					<button class="alt" @click="lineexport">export</button>
				</div>
			</main>
		</div>
	</template>

	  <!-- token:'UScaOPd4LsuzsEfnmjIveBcARduFRRfz7niD1p1m9TG'phpindy, -->
	  <!-- token:'WJBGD9HkINjarKGafuGbM3WCDdaZ0YdgveExsmKGiFv', me -->
	  <!-- eZRpibrv4UHOVoX5O7SEbLU7GVT8D85Gg4uMpEHVOum phppj-->
<script>
import LineAPI from "line-api";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import bootbox from "bootbox";
require("bootstrap");
import low from "lowdb";
import LocalStorage from "lowdb/adapters/LocalStorage";
const adapter = new LocalStorage("db");
const db = low(adapter);
if (!db.has("tokens").value()) {
  db.defaults({ tokens: [] }).write();
}
window.db = db;

let tokens = db.get("tokens").value();
let token = { token: "", name: "" };
if (tokens.length > 0) {
  token = tokens[0];
}

console.log("db posts--->", token);
export default {
  name: "landing-page",
  data() {
    return {
      message: "",
      token: token.token,
      gname: token.name,
      tokens: tokens,
      status: "",
      notify: {},
      sticker: "",
      stkid: 0,
      stkpkid: 0,
      fullsize: "",
      thumbnail: "",
      localfile: "",
      image: "",
      stickers: [
        { pk: 1, start: 1, end: 430 },
        { pk: 2, start: 18, end: 527 },
        { pk: 3, start: 180, end: 250 },
        { pk: 4, start: 260, end: 632 }
      ]
    };
  },
  methods: {
  	lineimport(){
  	 	let form = $(`<div><label>Token:</label><textarea style="width:100%;height:400px;" name="tokentxt"></textarea></div>`);
      bootbox.alert(form, () => { 
      		let t = form.find("textarea[name=tokentxt]").val();
      		t = JSON.parse(t);
      		console.log('tokendata-',t)
      		t.map(r=>{
    		  console.log(r);
    		  if(r.token != ''){
		          if (!db.get("tokens").find({ token: r.token }).value()) {
		            db.get("tokens").push({ token: r.token, name: r.name }).write(); //vuetw
		          }
    		  }
      		})
            this.tokens = db.get("tokens").value();
            this.$forceUpdate();
      });
  	},
  	lineexport(){
  		this.status = JSON.stringify(this.tokens);
  	},
    deltoken() {
      bootbox.confirm({
        message: "Are you sure want to delete this token ? ",
        buttons: {
          confirm: {
            label: "Yes",
            className: "btn-success"
          },
          cancel: {
            label: "No",
            className: "btn-danger"
          }
        },
        callback: result => {
          console.log(result);
          if (result) {
            let rs = db
              .get("tokens")
              .remove({ token: this.token, name: this.gname })
              .write();
            console.log("delete", rs);
            this.$forceUpdate();
            if (this.tokens.length > 0) {
              this.token = this.tokens[0].token;
              this.gname = this.tokens[0].name;
              this.linecfg();
            } else {
              this.token = "";
              this.gname = "";
              this.notify = "";
            }
          }
        }
      });
    },
    selectedtoken(event) {
      this.gname = event.target.selectedOptions[0].text;
      this.token = event.target.value;
      this.linecfg();
    },
    changetoken() {
      console.log("changetoken");
      let form = $(`<form id='infos' action=''>
				<table style="width:700px"><tr>
				<td style="width:60px">Token</td>
				<td style="width:400px"><input type='text' style="width:400px" name='token' /></td>
				</tr><tr>
				<td>Name:</td>
				<td width="400"><input type='text' style="width:400px" name='name' /></td>
				</tr></table>    	
		    	</form>`);
      bootbox.alert(form, () => {
        let t = form.find("input[name=token]").val();
        console.log(t);
        let n = form.find("input[name=name]").val();
        console.log(n);
        if (t != "" && n != "") {
          console.log("add token");
          if (!db.get("tokens").find({ token: t }).value()) {
            db.get("tokens").push({ token: t, name: n }).write(); //vuetw
            this.tokens = db.get("tokens").value();
            this.$forceUpdate();
          }
        }
      });
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      console.log(files);
      this.localfile = files[0].path;
      this.createImage(files[0]);
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = e => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function(e) {
      this.image = "";
      this.localfile = "";
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    stkchange() {
      console.log("stachange---->");
      console.log(this.stkid, this.maxid);
      if (this.stkid > this.maxid) {
        this.stkid = this.maxid;
      }
    },
    linecfg() {
      if (this.token != "") {
        this.notify = new LineAPI.Notify({
          token: this.token
        });
        this.linestatus();
      }
    },
    linestatus() {
      this.notify
        .status()
        .then(r => {
          this.status =
            "this token is : " +
            this.token +
            "\n" +
            JSON.stringify(this.notify.ratelimit) +
            "\n" +
            JSON.stringify(r);
          console.log(r, this.notify);
        })
        .catch(e => {
          this.status = JSON.stringify(e);
        });
    },
    linemsg() {
      if (this.token != "" && this.message != "") {
        if (this.stkid && this.stkpkid) {
          this.sticker = { packageId: this.stkpkid, id: this.stkid };
        }

        let cfg = {
          message: this.message,
          sticker: this.sticker,
          // sticker: 'smile', // shorthand
          // sticker : { packageId: 1, id: 2 } // exact ids
          image: this.localfile // local file
          // image: { fullsize: 'http://example.com/1024x1024.jpg', thumbnail: 'http://example.com/240x240.jpg' } // remote url
        };
        console.log("linenotify-->", cfg);

        this.notify
          .send(cfg)
          .then(r => {
            this.status = JSON.stringify(r);
            console.log(r);
          })
          .catch(e => {
            console.log("error--->", e);
            this.status = JSON.stringify(e);
          });
        this.sticker = null;
      } else {
        if (this.token == "") {
          this.status = "no token";
          alert("please add your token");
        } else {
          this.status = "Message no empty";
          alert("message no empty");
        }
      }
    }
  },
  created() {
    window.vc = this;
    this.linecfg();
  },
  computed: {
    countmsg() {
      let count = this.message.length;
      if (count > 999) alert("message can be max 1000 char");
      return count;
    },
    minid() {
      this.stkid = 0;
      this.stickers.map(s => {
        if (s.pk == this.stkpkid) {
          console.log("min", s.start);
          this.stkid = s.start;
          return s.start;
        }
      });
      return 0;
    },
    maxid() {
      if (this.stkpkid == 0) return 0;
      this.stickers.map(s => {
        if (s.pk == this.stkpkid) {
          console.log("max", s.end);
          if (this.stkid > s.end) this.stkid = s.end;
          return s.end;
        }
      });
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 10px 10px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 200px;
}

.lineimg {
  width: 50px;
  height: 50px;
}
.linerow {
  display: inline-flex;
  align-items: center;
  /*justify-content: center;*/
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 100%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
