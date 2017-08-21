import { Component, AfterViewInit, OnDestroy, NgZone, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

const TOP_BAR_HEIGHT = 54;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit, OnDestroy {
  ballD = 30;
  top = 0;
  left = 0;
  visible = false;

  canvasWidth = 0;
  canvasHeight = 0;

  constructor(public navCtrl: NavController, private zone: NgZone) {}

  ngAfterViewInit() {
    const canvas = document.getElementById('canvas');
    this.canvasWidth = canvas.offsetWidth;
    this.canvasHeight = canvas.offsetHeight;
    this.top = (this.canvasHeight - this.ballD) / 2;
    this.left = (this.canvasWidth - this.ballD) / 2;
    this.visible = true;
  }

  start() {
    window['cordova']['plugins']['sensorManager']['start']((result) => {
      this.zone.run(() => {
        let left = this.left - result.x * 15;
        if (left < 0) {
          left = 0;
        }
        if (left > this.canvasWidth - this.ballD) {
          left = this.canvasWidth - this.ballD;
        }
        let top = this.top + result.y * 15;
        if (top < TOP_BAR_HEIGHT) {
          top = TOP_BAR_HEIGHT;
        }
        if (top > this.canvasHeight - this.ballD) {
          top = this.canvasHeight - this.ballD;
        }
        this.left = left;
        this.top = top;
      });
    }, (err) => {
      console.log(err);
    }, 100);
  }

  stop() {
    window['cordova']['plugins']['sensorManager']['stop']();
  }

  ngOnDestroy() {
    this.stop();
  }
}
