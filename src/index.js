import "./css/w3.css";
import Run from "./run";

import RunView from "./runView";
import RunEntry from "./runEntry";
import RunController from './runController';

import UserController from "./userController";
import UserView from "./userView";

const userController = new UserController();
const userView = new UserView(userController);

const runController = new RunController(userController);
const runView = new RunView(runController);

export function submitJobEntry() {
  var form = document.getElementById("entry-form");
  var elements = form.elements;

  var obj = {};
  for (var i = 0; i < elements.length; i++) {
    var item = elements.item(i);
    if (item.name) {
      obj[item.name] = item.value;
    }
  }

  var runEntry = new RunEntry(
    obj["location"],
    obj["duration"],
    obj["yieldAmount"]
  );
  runController.store(runEntry);
}

export function addUser() {
  var form = document.getElementById("user-form");
  var elements = form.elements;

  var obj = {};
  for (var i = 0; i < elements.length; i++) {
    var item = elements.item(i);
    if (item.name) {
      obj[item.name] = item.value;
    }
  }
  var userName = obj["username"];

  // TODO perhaps return something?
  if(!userController.hasUser(userName))
  {
    userController.storeUser(userName);
    // immediately switch
    userController.setUser(userName);
    userView.layout();
    runController.loadRuns();
    runView.layout();
  }
}

export function onUserChange() {
  userView.onUserChange();
  runController.loadRuns();
  runView.layout();
}

export function confirmRemoveUser() {
  runController.removeAllRuns(userController.getCurrentUser());
  userController.removeUser(userController.getCurrentUser());
  // a new user will be selected
  userView.layout();
  runView.layout();
  closeModal('remove-user-form-modal');
}

export function prepareRemoveUser() {
  userView.prepareRemoveModal();
  openModal('remove-user-form-modal');
}


export function startApp() {
  userView.layout();
  runController.loadRuns();
  runView.layout();
  
  // TODO make this configurable between having it auto update or not
  // TODO add options - refresh rate and update to a datatable?
  window.setInterval(function () {
    runView.layout();
  }, 1000);
}
