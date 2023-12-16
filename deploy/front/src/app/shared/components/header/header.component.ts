import { Component, OnInit } from '@angular/core';
import { LINKS } from '../../consts';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() { }
  links = LINKS;
  ngOnInit() { }
  drawerColor(flag: boolean) {
    if (flag) {
      return { 'background-color': 'rgb(81,45,144)', 'border-radius': '10px'};
    }
    return {};
  }
}
