import { Component, OnInit } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

const MEDIA_FOLDER_NAME = 'my_media';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  files = [];

  constructor(
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture,
    private file: File,
    private media: Media,
    private streamingMedia: StreamingMedia,
    private photoViewer: PhotoViewer,
    private actionSheetController: ActionSheetController,
    private plt: Platform
  ) {}

  ngOnInit() {
    this.plt.ready().then(() => {
      let path = this.file.dataDirectory;

      this.file.checkDir(path, MEDIA_FOLDER_NAME).then(() => {
        this.loadFiles();
      },
      err => {
        this.file.createDir(path, MEDIA_FOLDER_NAME, false).then(() => {
          this.loadFiles();
        })
      });
    })
  }

  loadFiles() {
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(res => {
      this.files = res;
      console.log('file ', this.files);
      
    })
  }

  recordVideo(){
    this.mediaCapture.captureVideo().then((data: MediaFile[]) => {
      if(data.length > 0){
        this.copyFileToLocalDir(data[0].fullPath);
      }
    },
    (err: CaptureError) => console.error(err)
    );
  }
  copyFileToLocalDir(fullPath) {
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }

    const ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;

    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;

    this.file.copyFile(copyFrom, name, copyTo, newName).then(
      success => {
        this.loadFiles();
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  open(){
    console.log('test');
    
  }
}
