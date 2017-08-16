import { Component, OnDestroy, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy {
  result: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 };

  top = 0;
  left = 0;
  color = 'gray';

  constructor(public navCtrl: NavController, private zone: NgZone) {
    window['cordova']['plugins']['sensorManager']['initialize']();
  }

  start() {
    window['cordova']['plugins']['sensorManager']['watch']((result) => {
      console.log(result);
      this.result = result;


      const red = Math.floor(((result.x + 1) * 128) - 1);
      const green = Math.floor(((result.y + 1) * 128) - 1);
      const blue = Math.floor(((result.z + 1) * 128) - 1);

      this.zone.run(() => {
        this.left += result.x * 25;
        this.top -= result.y * 25;
        this.color = `rgb(${red}, ${green}, ${blue})`;
      });
    }, (err) => {
      console.log(err);
    }, 100);
  }

  stop() {
    window['cordova']['plugins']['sensorManager']['finish']();
  }

  ngOnDestroy() {
    this.stop();
  }

}
