import { Component, OnInit } from '@angular/core';
import { LINKS } from '../../consts';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
  copyright = `© ${new Date().getFullYear()} DeV & IMA`;
}
