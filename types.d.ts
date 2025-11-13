// here we define types shared across the application
import { Connection } from "mongoose";

// to allow global caching of the mongoose connection
declare global {
  var mongoose: {
    conn: Connection | null; // cached connection
    promise: Promise<Connection> | null; //we have used promise to avoid multiple connections being created simultaneously
  };
}

export {};
