import {channels} from"./services/api.js";
import { channelsList } from "./ui/sidebar.js";

console.log("main.js is connected");
channels();


channels().then((data)=>channelsList(data));

