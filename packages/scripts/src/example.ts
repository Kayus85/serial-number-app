import { Resource } from "sst";
import { Example } from "@serial-number-app/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
