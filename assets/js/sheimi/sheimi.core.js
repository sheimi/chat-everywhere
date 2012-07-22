/* ===================================================
 * sheimi.core.js 
 * ===================================================
 * Copyright 2012 sheimi.me.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function(window) {
  
/* --- fix of javascript object --- */

/* --- fix Array -- Author: xxx --- */
!function(Array) {
  if (Array.prototype.remove == undefined) {
    Array.prototype.remove = function(e) {
      var t, _ref;
      if ((t = this.indexOf(e)) > -1) {
        return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
      }
    }
  }
}(Array)


/* --- set up sheimi namespace --- */

function Sheimi(dict) {

  var sheimi = this

  /* --- function starts --- */
  function extend(dict) {
     _.extend(sheimi, dict)
  }

  for (var key in dict) {
    sheimi[key] = dict[key]
  }

  /* --- set methods --- */
  this.extend = extend

}

window.Sheimi = Sheimi
window.sheimi = new Sheimi()

}(window)
