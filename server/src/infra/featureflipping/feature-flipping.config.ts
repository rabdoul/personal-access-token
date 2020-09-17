import { FeatureFlippingConfig } from "../../application/FeatureFlipping";

const LOCAL_FF_CLIENT_ID = "5ece83ef12f8820adfdaecef";

const { FF_CLIENT_ID = LOCAL_FF_CLIENT_ID } = process.env;

export class TheFeatureFlippingConfig implements FeatureFlippingConfig {
  readonly clientKey: string = FF_CLIENT_ID
}