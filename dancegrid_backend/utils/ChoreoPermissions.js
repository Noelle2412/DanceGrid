import { ChoreoModel } from "../models/Choreo";
import ResponseError from "./ResponseError";

export async function canAccessChoreo(req) {
  const choreo = await ChoreoModel.findById(req.params.id);
  if (!choreo) throw new ResponseError("Choreo not found", 404);
  const isOwner = choreo.owner.equals(req.user._id);
  const isSharedWith = choreo.sharedWith.includes(req.user._id);
  if (!isOwner && !isSharedWith)
    throw new ResponseError("You can not access this choreography", 403);
  else {
    return choreo;
  }
}

export async function ownerOfChoreo(req) {
  const choreo = await ChoreoModel.findById(req.params.id);
  if (!choreo) throw new ResponseError("Choreo not found", 404);
  const isOwner = choreo.owner.equals(req.user._id);
  if (!isOwner)
    throw new ResponseError("You are not the owner of this choreo", 403);
  else {
    return choreo;
  }
}
