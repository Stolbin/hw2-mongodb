import { model, Schema } from "mongoose";

const sessionSchme = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      require: true,
      unique: true,
    },
    accessToken: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: String,
      require: true,
    },
    accessTokenVakidUnitl: {
      type: Date,
      require: true,
    },
    refreshTokenValidUtil: {
      type: Date,
      require: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Sessions = model("Session", sessionSchme);
