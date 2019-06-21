import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ui';
  // json$: Observable<any>;
  json: any;
  tasks: any;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.showConfig();
  }

  showConfig() {
    this.configService.getConfig()
      .subscribe(
        (data: any) => {

          console.log(JSON.parse(JSON.stringify(data)));
          data = this.renameKeys(data);
          data = this.removeKeys(data);

          this.tasks = Object.values(data.Software.ConEmu['.Vanilla'].Tasks).reduce((taskArray: Array<any>, task: string) => {
            console.log(task);
            taskArray.push(task);
            return taskArray;
          }, []);

          console.log(this.tasks);
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('done');
        });
  }



      // jsonObj = parser.parse(xmlData);
  renameKeys (json: any) {

    if (!json) { return json; }
    if (!json.key) {
      delete json['@_name'];
      delete json['@_build'];
      delete json['@_modified'];
      return json;
    }
    if (Array.isArray(json)) {
      (json as any).name = this.renameArrayKeys(json);
    }
    else if (Array.isArray(json.key)) {
    //  json.key.forEach((element) => {
        // if (!element.key) { return element; }
        this.renameArrayKeys(json.key);
        delete json['@_name'];
        delete json['@_build'];
        delete json['@_modified'];
      // });
    } else {
      const name = json.key['@_name'];
      // console.log(name);
      json[name] = this.renameKeys(json.key);
      delete json.key;
      delete json['@_name'];
      delete json['@_build'];
      delete json['@_modified'];
    }
    return json;
  }


  renameArrayKeys (array: any) {
    // console.log(array);
    if (!array || array.length < 1) { return {}; }
    // console.log(array);
    array.forEach((element, index) => {
      // if (!element.key) { return element; }
      const name = element['@_name'];
      // console.log(name);
      array[name] = this.renameKeys(array[index]);
      delete array[index];
      // console.log(array);
    });
  }

  removeKeys (json: any) {
    if (!json) { return json; }
    if (!json.key) {
      if (Array.isArray(json)) {
        json.forEach((element, index) => {
          this.removeKeys(json[index]);
        });
      } else {
        Object.keys(json).forEach((key) => {
          // Values do not contain keys
          if (key !== 'value') {
            this.removeKeys(json[key]);
          }
        });
      }
    } else {
      Object.keys(json.key).forEach((key) => {
        json[key] = this.removeKeys(json.key[key]);
      });
      delete json.key;
    }
    return json;
  }




  // renameValues (json: any) {

  //   if (Array.isArray(json.value)) {
  //     json.forEach((element, index) => {
  //       this.renameValues(json.value[index]);
  //     });
  //   } else if (json.value) {
  //     const name = json.value['@_name'];
  //     console.log(name);
  //     json['@_name'] = this.renameValues(json.value);
  //     delete json.value;
  //   }

  //   if (Array.isArray(json)) {
  //     json.forEach(element => {
  //       this.renameValues(element);
  //     });
  //   } else {
  //     Object.values(json).forEach(element => {
  //       this.renameValues(element);
  //     });
  //   }
  // }

  // renameArrayValues (array: any) {
  //   console.log(array);
  //   if (!array || array.length < 1) { return {}; }
  //   console.log(array);
  //   array.forEach((element, index) => {
  //     // if (!element.key) { return element; }
  //     const name = element['@_name'];
  //     console.log(name);
  //     array[name] = this.renameValues(array[index]);
  //     delete array[index];
  //     console.log(array);
  //   });
  // }
}
