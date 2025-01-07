/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
import type { UserData } from "../lib/auth";

declare namespace App {
  interface Locals {
    sessionData: UserData;
  }
}
