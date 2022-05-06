/// <reference types="@altv/types-natives" />
import * as native from 'natives';
import { Vector3 } from './vector';

export class Camera {
  cam;
  position;
  rotation;
  fov;

  // @ts-ignore
  constructor(position, rotation, fov) {
    this.position = position;
    this.rotation = rotation;
    this.fov = fov;

    this.cam = native.createCamWithParams(
      'DEFAULT_SCRIPTED_CAMERA',
      this.position.x,
      this.position.y,
      this.position.z,
      this.rotation.x,
      this.rotation.y,
      this.rotation.z,
      this.fov,
      true,
      0
    );
  }

  render() {
    native.renderScriptCams(true, false, 0, true, false);
  }

  unrender() {
    native.renderScriptCams(false, false, 0, false, false);
  }

  setPosition(pos) {
    this.position = pos;

    native.setCamCoord(
      this.cam,
      this.position.x,
      this.position.y,
      this.position.z
    );
    this.render();
  }

  setRotation(rot) {
    this.rotation = rot;

    native.setCamRot(
      this.cam,
      this.rotation.x,
      this.rotation.y,
      this.rotation.z,
      0
    );
    this.render();
  }

  get direction() {
    let z = this.rotation.z * 0.0174532924;
    let x = this.rotation.x * 0.0174532924;

    let num = Math.abs(Math.cos(x));

    return new Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
  }
}
