import * as ClipperLib from 'js-clipper';
import * as COLORS from './utils/colors';
import * as MeshGuru from './utils/mesh_guru';
import Vector from './utils/vector';
import ClipperOffsetMap from './clipper_offset_map';

class ClipperMap {
  constructor(paths = null) {
    this.clipper = new ClipperLib.Clipper();
    this.paths = paths || new ClipperLib.Paths();
    this.holesI = {};
    this.isUnion = true;
    this._checkHoles();
  }

  selectPrimaryMesh(pt) {
    pt = {
      X: pt.x,
      Y: pt.y
    };
    this.startPoint = pt;
    let biggestTargetIdx = null;
    let maxArea = 0;
    for(let i=0;i<this.paths.length;i++) {
      if(!this.holesI[i] && MeshGuru.contains(this.paths[i], pt)) {
        const area = MeshGuru.area(this.paths[i]);
        if(area > maxArea) {
          maxArea = area;
          biggestTargetIdx = i;
        }
      }
    }
    if(biggestTargetIdx !== null)
      return this._createOffsets(biggestTargetIdx);
    return null;
  }

  selectPrimaryBiggest() {
    let maxArea = -1;
    let biggestTargetIdx = null;
    for(let i=0;i<this.paths.length;i++) {
      if(!this.holesI[i]) {
        const area = MeshGuru.area(this.paths[i]);
        if(area > maxArea) {
          maxArea = area;
          biggestTargetIdx = i;
        }
      }
    }
    const offsetMap = this._createOffsets(biggestTargetIdx);
    this.startPoint = offsetMap.getAnyPoint();
    return offsetMap;
  }

  inLineOfSight(a, b) {
    let isCrossing;
    for(let i=0;i<this.paths.length;i++) {
      const poly = this.paths[i];
      for(let j=0;j<poly.length;j++) {
        isCrossing = MeshGuru.lineSegmentsCross(a, b,
          poly[j], poly[j + 1 === poly.length ? 0 : j + 1]);
        if(isCrossing) {
          return false;
        }
      }
    }
    return true;
  }

  addPath(path) {
    let clipper = new ClipperLib.Clipper();
    clipper.AddPaths(this.paths, ClipperLib.PolyType.ptSubject,true);
    clipper.AddPath(path, ClipperLib.PolyType.ptClip,true);
    let answer = new ClipperLib.Paths();
    const mode = this.isUnion ? ClipperLib.ClipType.ctUnion :
      ClipperLib.ClipType.ctDifference;
    clipper.Execute(mode, answer);
    this.paths = answer;
    this._checkHoles();
  }

  _createOffsets(targetIdx) {
    const relevantHoles = [];
    const allHoles = Object.keys(this.holesI);
    for(let i=0; i<allHoles.length; i++) {
      const h = allHoles[i];
      const curr = this.holesI[h];
      if(this.holesI[h] === targetIdx.toString()){
        relevantHoles.push(this.paths[h]);
      }
    }
    return new ClipperOffsetMap(this.paths[targetIdx], relevantHoles, this);
  }

  _checkHoles() {
    this.holesI = {};
    for(let i=0; i<this.paths.length; i++) {
      const outterPoly = this.paths[i];
      for(let j=0;j<this.paths.length;j++) {
        if(i === j)
          continue;
        const innerPoly = this.paths[j];
        if(this._isHole(outterPoly, innerPoly))
          this.holesI[j] = i.toString();
      }
    }
  }

  /// return false if one point is not contained within the polygon
  /// otherwise, return true
  _isHole(outterPoly, innerPoly) {
    for(let ptI = 0; ptI < innerPoly.length; ptI++) {
      if(!MeshGuru.contains(outterPoly, innerPoly[ptI]))
        return false;
    }
    return true;
  }

  draw(ctx) {
    ctx.strokeStyle = COLORS.BORDER;
    ctx.lineWidth = 2;
    for(let i=0;i<this.paths.length;i++) {
      const path = this.paths[i];
      ctx.fillStyle = COLORS.BLUEPRINT;
      if(this.holesI[i])
        ctx.fillStyle = COLORS.AUTOMA_BORDER;
      ctx.beginPath();
      for(let j=0;j<path.length;j++) {
        ctx.lineTo(path[j].X, path[j].Y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
}
export default ClipperMap;
