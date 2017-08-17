import { Component, AfterViewInit, OnDestroy, NgZone, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

const TOP_BAR_HEIGHT = 54;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas;
  ballWidth = 30;
  top = 0;
  left = 0;
  visible = false;

  canvasWidth = 0;
  canvasHeight = 0;

  constructor(public navCtrl: NavController, private zone: NgZone) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.canvasWidth = this.canvas.contentWidth;
      this.canvasHeight = this.canvas.contentHeight;
      this.top = (this.canvasHeight - this.ballWidth) / 2;
      this.left = (this.canvasWidth - this.ballWidth) / 2;
      this.visible = true;
    }, 1000);
  }

  start() {
    window['cordova']['plugins']['sensorManager']['initialize']();
    window['cordova']['plugins']['sensorManager']['watch']((result) => {
      this.zone.run(() => {
        let left = this.left - result.x * 15;
        if (left < 0) {
          left = 0;
        }
        if (left > this.canvasWidth - this.ballWidth) {
          left = this.canvasWidth - this.ballWidth;
        }
        let top = this.top + result.y * 15;
        if (top < TOP_BAR_HEIGHT) {
          top = TOP_BAR_HEIGHT;
        }
        if (top > this.canvasHeight - this.ballWidth) {
          top = this.canvasHeight - this.ballWidth;
        }
        this.left = left;
        this.top = top;
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
