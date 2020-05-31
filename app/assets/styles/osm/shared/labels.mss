
@name: [nuti::lang] ? ([name:[nuti::lang]] ? [name:[nuti::lang]] : ([name:[nuti::fallback_lang]] ? [name:[nuti::fallback_lang]] : [name])) : [name];
@osm_icon: [nuti::osm-[subclass]] ? [nuti::osm-[subclass]] : [nuti::osm-[class]];
@maki_icon: [nuti::maki-[subclass]] ? [nuti::maki-[subclass]] : [nuti::maki-[class]];
@featureId: [osmid];
// @id_test: (([osm_id]) = [nuti::selected_id]) ? #f00 : #fff;
// @name_test: (([name]) = [nuti::selected_name]) ? #0f0 : #fff;


#water_name[class=ocean][zoom>=3][zoom<=9],
#water_name[class=sea][zoom>=6] {
	text-name: @name;
	text-face-name: @mont_it_md;
	text-wrap-width: 50;
	text-wrap-before: true;
	text-fill: @marine_labels;
	text-halo-fill: @marine_labels_halo;
	text-halo-radius: 1;
	text-line-spacing: -2;
	text-character-spacing: 1.1;
	text-size: linear([view::zoom], (2, 14.0), (5, 20.0));
	
	[class=sea]{
		text-size: 12;
	}
}

// #park['mapnik::geometry_type'=1][zoom<=16]{
// 	[class=national_park][zoom>=6],
// 	[zoom>=8]
// 	// [class=aboriginal_lands][zoom>=12],
// 	// [class=protected_area][zoom>=12]
// 	{
// 		text-name: [name];
// 		text-face-name: @mont_md;
//         text-fill: #008000;
//         [class='aboriginal_lands']{
//             text-fill: @aboriginal;
//         }
// 		text-halo-fill: @peak_halo;
// 		text-halo-rasterizer: fast; 
// 		text-halo-radius: 1
//         // text-largest-bbox-only: false;
//         text-wrap-width: 150;
//         text-wrap-before: true;
// 		text-size: linear([view::zoom], (12, 9), (15, 12.0));
//         // text-placement: line;
//         text-min-distance: 150;
// 	}
// }

// #landuse ['mapnik::geometry_type'=3] [name!=null][zoom >= 15][zoom <=16],
// #landcover ['mapnik::geometry_type'=3] [name!=null][zoom >= 15][zoom <=16]
// {
//     text-name: [name];
//     text-halo-radius: @standard-halo-radius;
//     text-halo-fill: @standard-halo-fill;
//     text-fill: #555;
//     text-size: 8;
//     text-face-name: @book-fonts;
// 	text-placement: [nuti::markers3d];
// // text-dy: 8;
//     text-vertical-alignment: middle;
//     text-spacing: 400;
// 	text-wrap-width: 20;
// }
// #landuse[name!=null][zoom>=15],
// #landcover[name!=null][zoom>=15] {
// 	text-name: @name;
// 	text-face-name: @mont;
// 	text-fill: @building_label;
// 	text-size: 9;
// }  

#place{
	[class=continent][zoom>=1][zoom<=2]{
		text-name: @name;
		text-fill: @continent_text;
		text-face-name: @mont_md;
		text-transform: uppercase;
		text-halo-fill: @continent_halo;
		text-halo-radius: 1;
		text-character-spacing: 0.5;
		text-size: linear([view::zoom], (1, 10.0), (2, 14.0));
		text-wrap-width: step([zoom], (1, 20), (2, 40));
	}
	[class=country]{
		[rank=1][zoom>=3][zoom<=6], 
		[rank=2][zoom>=3][zoom<=7],
		[rank=3][zoom>=4][zoom<=8], 
		[rank=4][zoom>=5][zoom<=9], 
		[rank=5][zoom>=6][zoom<=10], 
		[rank>=6][zoom>=7][zoom<=10]{
			text-name: @name;
			text-face-name: @mont_md;
			text-placement: [nuti::texts3d];
			text-size: 0;
			text-halo-fill: @country_halo;
			text-halo-radius: 1;
			text-halo-rasterizer: fast;
			text-wrap-width: 30;
			text-wrap-before: true;
			text-line-spacing: -2;
			text-min-distance: 2;
			text-transform: uppercase;
			text-character-spacing: 0.5;
			text-fill: linear([view::zoom], (4, @country_text_dark), (5, @country_text_med), (6, @country_text_light));

	
			[rank=1][zoom>=2]{
				text-size: linear([view::zoom], (2, 10.0), (5, 13.0), (6, 15.0));
				text-wrap-width: step([zoom], (2, 60), (3, 80), (4, 100), (5, 120), (6, 140));
			}
			[rank=2][zoom>=3]{
				text-size: linear([view::zoom], (3, 10.0), (6, 13.0));
				text-wrap-width: step([zoom], (3, 60), (4, 70), (5, 80), (6, 100));
			}
			[rank=3][zoom>=4]{
				text-size: linear([view::zoom], (4, 10.0), (8, 14.0));
				text-wrap-width: step([zoom], (4, 30), (5, 60), (8, 120));
			}
			[rank=4][zoom>=5]{
				text-size: linear([view::zoom], (5, 10.0), (9, 14.0));
				text-wrap-width: step([zoom], (5, 30), (6, 60), (7, 90), (8, 120));
			}
			[rank=5][zoom>=5]{
				text-size: linear([view::zoom], (5, 10.0), (9, 14.0));
				text-wrap-width: step([zoom], (6, 30), (7, 60), (8, 90), (9, 120));
			}
			[rank>=6][zoom>=6]{
				text-size: linear([view::zoom], (6, 10.0), (9, 13.0));
				text-wrap-width: 30;
			}
		}
	}
	[class=state][zoom>=6][zoom<=10]{
		[zoom>=5][rank<=2],
		[zoom>=6][rank<=4],
		[zoom>=7][rank<=99]{
			text-name: @name;
			text-face-name: @mont_md;
			text-placement: [nuti::texts3d];
			text-fill: @state_text;
			text-halo-fill: @state_halo;
			text-halo-radius: 1;
			text-halo-rasterizer: fast;
			text-transform: uppercase;
			text-allow-overlap: false;
			text-wrap-before: true;
			text-min-distance:5;
			text-size: linear([view::zoom], (5, 11.0), (6, 12.0), (7, 13.0));
			text-wrap-width: step([zoom], (5, 60), (6, 80), (7, 100));
		}
	}
	
	[class=city]{
		[zoom>=4][zoom<=7]{
			[zoom>=4][rank<=2],
			[zoom>=5][rank<=4],
			[zoom>=6][rank<=6],
			[zoom>=7][rank<=7]{
				::icon {
					text-placement: [nuti::markers3d];
					text-name: [nuti::maki-circle];
					text-size: 6;
					text-face-name: @maki;
					text-fill: @place_text;
				}
				::label {
					text-name: @name;
					text-size: 10;
					text-face-name: @mont_md;
					text-placement: [nuti::texts3d];
					text-fill: @place_text;
					text-halo-fill: @place_halo;
					text-halo-radius: 1;
					text-halo-rasterizer: fast;
					text-line-spacing: -2;
					text-dx: -5;
					text-dy: 0;
					text-min-distance: 3;
					text-size: linear([view::zoom], (4, 10.0), (5, 11.0), (6, 12.0), (7, 13.0)) - ([rank] / 3.0);
					text-wrap-width: step([zoom], (4, 40), (5, 50), (6, 60));
					[zoom>=5][rank>=0][rank<=2],
					[zoom>=7][rank>=3][rank<=5] { 
						text-transform:uppercase;
					}
				}
			}
			[zoom>=8][zoom<=14][rank<=11],
			[zoom>=9][zoom<=14][rank<=12],
			[zoom>=10][zoom<=14][rank<=15]{
				text-name: @name;
				text-face-name: @mont_md;
				text-placement: [nuti::texts3d];
				text-fill: @place_text;
				text-halo-fill: @place_halo;
				text-halo-radius: 1;
				text-halo-rasterizer: fast;
				text-line-spacing: -2;
				text-size: linear([view::zoom], (8, 13.0), (14, 21.0)) - ([rank] / 2.0);
				text-wrap-width: step([zoom], (8, 50), (9, 60), (11, 70), (12, 80), (13, 120), (14, 200));

				[zoom=8][rank<=7],
				[zoom=9][rank<=10],
				[zoom>=10] {
					text-transform: uppercase;
				}
			}
		}

		[zoom>=8][zoom<=14][rank<=11],
		[zoom>=9][zoom<=14][rank<=12],
		[zoom>=10][zoom<=14][rank<=15]{
			text-name: @name;
			text-face-name: @mont_md;
			text-placement: [nuti::texts3d];
			text-fill: @place_text;
			text-halo-fill: @place_halo;
			text-halo-radius: 1;
			text-halo-rasterizer: fast;
			text-line-spacing: -2;
			text-size: linear([view::zoom], (8, 13.0), (14, 21.0)) - ([rank] / 2.0);
			text-wrap-width: step([zoom], (8, 50), (9, 60), (11, 70), (12, 80), (13, 120), (14, 200));

			[zoom=8][rank<=7],
			[zoom=9][rank<=10],
			[zoom>=10] {
				text-transform: uppercase;
			}
		}
	}
	[class=town] {
		[zoom>=9][zoom<=14][rank<=12],
		[zoom=15]{
			text-name: @name;
			text-face-name: @mont_md;
			text-placement: [nuti::texts3d];
			text-fill: @place_text;
			text-halo-fill: @place_halo;
			text-halo-radius: 1;
			text-halo-rasterizer: fast;
			text-wrap-before: true;
			text-line-spacing: -2;
			text-size: linear([view::zoom], (9, 9.0), (13, 13.0), (14, 15.0), (15, 17.0));
			text-wrap-width: step([zoom], (9, 70), (15, 80));
		}
	}
	[class=village] {
		[zoom>=10][zoom<=12][rank<=11],
		[zoom>=13]{
			text-name: @name;
			text-face-name: @mont_md;
			text-placement: [nuti::texts3d];
			text-fill: @place_text;
			text-halo-fill: @place_halo;
			text-halo-radius: 1;
			text-halo-rasterizer: fast;
			text-wrap-before: true;
			text-line-spacing: -2;
			text-size: linear([view::zoom], (11, 9.0), (12, 10.0), (13, 11.0), (16, 16.0));
			text-wrap-width: step([zoom], (12, 80), (13, 90), (14, 120), (15, 140), (16, 160));
		}
	}
	[class=suburb]{
		[zoom>=12][zoom<=14][rank<=11],
		[zoom>=15][zoom<=16]{
			text-name: @name;
			text-face-name: @mont_md;
			text-placement: [nuti::texts3d];
			text-fill: @place_text;
			text-halo-fill: @place_halo;
			text-halo-radius: 1;
			text-halo-rasterizer: fast;
			text-wrap-before: true;
			text-line-spacing: -2;
			text-size: linear([view::zoom], (12, 9.0), (13, 10.0), (16, 13.0));
			text-wrap-width: step([zoom], (12, 60), (13, 80), (14, 90), (15, 100), (16, 120));
		}
	}
	[class=hamlet],
	[class=island],
	[class=islet],
	[class=neighbourhood] {
		[zoom>=12][zoom<=16][rank<=12],
		[zoom>=16][zoom<=17]{
			text-name: @name;
			text-face-name: @mont_it_md;
			text-placement: [nuti::texts3d];
			text-fill: @place_text;
			text-halo-fill: @place_halo;
			text-halo-radius: 1;
			text-halo-rasterizer: fast;
			text-wrap-before: true;
			text-line-spacing: -2;
			text-size: linear([view::zoom], (14, 9.0), (16, 13.0), (17, 15.0));
			text-wrap-width: step([zoom], (13, 50), (14, 80), (15, 100), (16, 120), (17, 140));
		}
	}
	[class=isolated_dwelling],
	[class=locality] {
		[zoom>=13][zoom<=16][rank<=12],
		[zoom>=16][zoom<=17]{
			text-name: @name;
			text-face-name: @mont;
			text-placement: [nuti::texts3d];
			text-fill: @place_text;
			text-halo-fill: @place_halo;
			text-halo-radius: 1;
			text-halo-rasterizer: fast;
			text-wrap-before: true;
			text-line-spacing: -2;
			text-size: linear([view::zoom], (14, 8.0), (17, 14.0));
			text-wrap-width: step([zoom], (13, 40), (17, 130));
		}
	}
}

#water_name [class=lake][zoom>=13],
#landcover[class=ice][subclass=glacier][name!=null][zoom>=13]{
	text-name: @name;
	text-face-name: @mont_it;
	text-placement: [nuti::texts3d];
	text-fill: @water_label;
	text-wrap-before: true;
	text-min-distance:30;
	text-size: linear([view::zoom], (12, 8.0), (18, 12.0));
	text-wrap-width: 80;
}

#waterway{
	[class=stream][zoom>=13],
	[class=riverbank][zoom>=13],
	[class=river],
	[class=riverbank],
	[class=stream][zoom>=13],
	[class=canal][zoom>=13],
	[class=dam][zoom>=15],
	[class=weir][zoom>=15],
	[class=lock][zoom>=16],
	[class=ditch][zoom>=15],
	[class=drain][zoom>=15]{

	text-min-distance: linear([view::zoom], (10, 10), (16, 50));
	text-name: @name;
	text-face-name: @mont;
	text-fill: @water_label;
	// text-avoid-edges: true;
	text-halo-rasterizer: fast;
	text-placement: line;
	text-dy:1;
	// text-character-spacing: 1;
	text-wrap-width: step([zoom], (13, 80), (17, 150));
	text-size: linear([view::zoom], (10, 7.0), (15, 8.0), (16, 10.0), (17, 11.0));
}
}


#transportation_name['mapnik::geometry_type'=2]{
	[class=track][zoom>=13],
	[class=path][subclass=path][zoom>=14],
	[class=path][subclass!=track][subclass!=footway][zoom>=15] {
			text-name: @name;
			text-fill: #222;
			text-size:linear([view::zoom], (13, 7), (16, 8), (17, 9));
			text-halo-radius: @standard-halo-radius;
			text-halo-fill: @standard-halo-fill;
			text-spacing: 300;
			// text-clip: false;
			text-placement: line;
			text-face-name: @mont;
			// text-vertical-alignment: middle;
			text-dy: 5;
			text-min-distance: @major-highway-text-repeat-distance;
			[subclass=steps] { 
				text-min-distance: @minor-highway-text-repeat-distance;
			 }
		// [zoom>=16] {
			// text-size: 8;
			// text-dy: 7;
		// }
		// [zoom>=17] {
			// text-size: 10;
			// text-dy: 9;
		// }
	}
	// [class=path][zoom>=15] {
	// 	[subclass=bridleway],
	// 	[subclass=footway],
	// 	[subclass=path],
	// 	[subclass=steps] {
	// 		text-name: @name;
	// 		text-fill: #222;
	// 		text-size: 7;
	// 		text-halo-radius: @standard-halo-radius;
	// 		text-halo-fill: @standard-halo-fill;
	// 		// text-spacing: 300;
	// 		// text-clip: false;
	// 		text-placement: line;
	// 		text-face-name: @mont;
	// 		text-vertical-alignment: middle;
	// 		text-avoid-edges: false;
	// 		text-dy: 7;
	// 		// text-min-distance: @major-highway-text-repeat-distance;
	// 		[subclass=steps] { 
	// 			text-min-distance: @minor-highway-text-repeat-distance;
	// 		 }
	// 		[zoom>=17] {
	// 			text-size: 10;
	// 			text-dy: 9;
	// 		}
	// 	}
	// }
	// [class='motorway'][zoom>=7][zoom<=10][ref_length<=6]
	// // [class='motorway'][zoom>=9][zoom<=10][ref_length<=6],
	// // [zoom>=11][ref_length<=6] 
	// {
	// 	text-name: [ref];
	// 	text-size: 9;
	// 	text-min-distance: 50;
	// text-line-spacing: -4;
	// 	// text-file: url(shield/default-[ref_length].svg);
	// 	text-face-name: @mont;
	// 	text-fill: #333;
	// 	[zoom>=14] {
	// 		text-size: 11;
	// 	}
	// }


	// [class='motorway'][zoom>=7][zoom<=10][ref_length<=6],
	// [class='motorway'][zoom>=9][zoom<=10][ref_length<=6] {
	// 	text-min-distance: 50;
	// 	text-size: 8;
	// 	text-placement: point;
	// 	text-avoid-edges: false;
	// }
	// [zoom>=11][ref_length<=6] {
	// 	text-placement: line;
	// 	text-spacing: 400;
	// 	text-min-distance: 100;
	// 	text-avoid-edges: true;
	// }

	[class=motorway][zoom>=9],
	[class=trunk][zoom>=10],
	[class=primary][zoom>=14],
	[class=track][zoom>=15],
	[class=tertiary][zoom>=15],
	[class=secondary][zoom>=15],
	[class=minor][zoom>=16],
	[class=service][zoom>=17],
	[class=aerialway][zoom>=14]{
		// text-avoid-edges: false;
		text-name: @name;
		text-placement: line;
		text-wrap-before: true;
		text-face-name: @mont;
		text-fill: @road_text;
		text-halo-fill: @minor_halo;
		text-halo-radius: 1;
		text-halo-rasterizer: fast;
		text-min-distance: 5;
		text-size: linear([view::zoom], (13, 6.0), (18, 8.0));
		text-vertical-alignment: middle;
		
		[class=motorway],
		[class=trunk],
		[class=primary]{
			text-halo-fill: @primary_halo;
			text-size: linear([view::zoom], (13, 6.0), (18, 13.0)) + 0.00004;
			[class=motorway], [class=trunk] { text-halo-fill: @motorway_halo; }
		}
		
		[class=secondary],
		[class=tertiary]{
			text-size: linear([view::zoom], (13, 4.0), (18, 12.0)) + 0.00003;
		}
		[class=minor]{
			text-size: linear([view::zoom], (13, 2.0), (18, 10.0)) + 0.00002;
		}
		[class=service]{
			text-size: linear([view::zoom], (13, 6.0), (18, 10.0)) + 0.00001;
		}
	}
}

// #park['mapnik::geometry_type'=1][zoom<=16], 
// #poi [class!='information'][subclass!='viewpoint'][subclass!=artwork][subclass!=dog_park][subclass!=playground],
// #poi [class='information'][name!=null],
// #poi [subclass='viewpoint'][name!=null]{
#poi{
	[class!=null] {
		// [class=national_park][zoom>=6],
	// [class=protected_area][zoom>=9],
	// [class=aboriginal_lands][zoom>=9],
		[class=lodging][subclass='alpine_hut'],
		[class=lodging][subclass='wilderness_hut'],
		[class=spring],
		// [class=lodging][subclass='wilderness_hut'][rank<=10][zoom>=11],
		[class=campsite][rank<=10],
		// [zoom>=14][rank<=1][class!='information'][class!='toilets'][class!='bus'][subclass!='tram_stop'][subclass!='station'][class!='picnic_site'][subclass!='viewpoint'],
		// [zoom>=15][rank<=2][class!='toilets'][class!='information'][class!='bus'][subclass!='tram_stop'][subclass!='station'][subclass!='viewpoint'],
		// [class=park][zoom>=15][rank<=10],
		[zoom>=16][rank<=10],
		// [class=park][zoom>=16][rank<=20],
		[zoom>=17][rank<=50],
		// [class=park][zoom>=17][rank<=30],
		[zoom>=18] {

			// shield-name: @name;
			// shield-file: url(symbols/icons/shower.svg);
			// shield-face-name: @mont;
			// shield-placement: [nuti::markers3d];
			// shield-line-spacing: -1;
			// shield-min-distance : 200;
			// shield-fill: @poi_dark;
			// shield-halo-fill: @peak_halo;
			// shield-halo-rasterizer: fast;
			// shield-halo-radius: linear([view::zoom], (14, 1), (18, 0.5));
			// shield-size: linear([view::zoom], (14, 7), (18, 10)) - 0.000001 * [rank];
			// shield-wrap-width: linear([zoom], (13, 10), (18, 100));
			// shield-feature-id: @featureId;
			// shield-dy: 15;

			::icon {
						// text-min-distance: 4;
				text-placement: [nuti::markers3d];
				text-name: @osm_icon;
				// text-name: [nuti::osm-peak];
				text-size: linear([view::zoom], (18, 10), (20, 14.0)) - 0.000001 * [rank];
				text-face-name: @osm;
				text-feature-id: @featureId;
				text-halo-fill: @peak_halo;
				// text-min-distance: 4;
				text-halo-rasterizer: fast;
				text-halo-radius: linear([view::zoom], (14, 1), (18, 0.5));
				text-fill: #495063;
				[class='park'] {
					text-fill: #76BC54;
				}
				[class='national_park'],[class='protected_area'] {
					text-fill: @national_park;
				}
				[class='aboriginal_lands'] {
					text-fill: @aboriginal;
				}
				[class=lodging],[class='campsite'] {
					text-fill: #854d04;
				}
				[class='hospital'] {
					text-fill: #4AA0E7;
				}
				[class='fountain'],[class='drinking_water'],[class='bassin'],[class='spring'] {
					text-fill: #4AA0E7;
				}
				[class='bakery'], [class='restaurant'] {
					text-fill: #EF8000; 
				}
			}

			[class!='information'][subclass!='viewpoint'] {
				// [class='bus'][zoom>=17],
				// [class='railway'][zoom>=17],
				::label {
					text-name: @name;
					text-face-name: @mont;
					text-placement: [nuti::markers3d];
					text-line-spacing: -1;
					// text-wrap-before: true;
					text-fill: @poi_dark;
					text-halo-fill: @peak_halo;
					text-halo-rasterizer: fast;
					text-halo-radius: linear([view::zoom], (14, 1), (18, 0.5));
					text-size: linear([view::zoom], (14, 7), (18, 10)) - 0.000001 * [rank];
					text-wrap-width: step([zoom], (13, 10), (18, 100));
					// text-feature-id: @featureId;
					// text-min-distance: 500;
					text-dy: linear([view::zoom], (14, 10), (18, 10)) - 0.000001 * [rank];
					// text-dy: 13;

					[class='bus'][zoom<17],
					[class='railway'][zoom<17] {
						text-opacity:0;
						text-halo-opacity:0;
					}
					
					[class='national_park'],[class='protected_area'], [class='aboriginal_lands'] {
						text-fill: @national_park;
						text-wrap-width: step([zoom], (13, 80), (15, 180));
						text-size: 10;
						[class='aboriginal_lands'] {
							text-fill: @aboriginal;
						}
					}
				}
				
			}
		}
		
	}
}

#mountain_peak {
	shield-name: @name ?  ( [ele] ? [ele] + 'm' + '\n ' + @name : @name): '';
	shield-face-name: @mont_md;
	// shield-size: 9;
	shield-size: linear([view::zoom], (7, 7), (13, 8), (18, 12))- 0.000001 * [rank]; 
	shield-line-spacing: -1;
	shield-placement: [nuti::markers3d];
	shield-file: url(symbols/[class].svg);
	shield-fill: darken(@peak_label, 20%);
	shield-dy: linear([view::zoom], (7, 15), (13, 16), (18, 20)); 
	shield-feature-id: @featureId;
	
	// shield-halo-fill: @peak_halo;
	// shield-halo-rasterizer: fast;
	// shield-halo-radius: linear([view::zoom], (14, 1), (18, 0.5));
}

// #mountain_peak {
// 	// [class=peak][zoom>=7],
// 	// [zoom>=12]{
// 	// [osm_id = 'nuti::selected_id'],
// 	// [name = 'nuti::selected_name'],
// 	::icon {
// 	// 	[zoom>=4][comment =~'.*Highest.*'],
// 	// [zoom>=4][comment =~'.*highest.*'],
// 	// [zoom>=7][ele>=4000],
// 	// [zoom>=8][ele>=3000],
// 	// [zoom>=9][ele>=2000],
// 	// [zoom>=10][ele>=1500],
// 	// [zoom>=11] {
// 			text-placement: [nuti::markers3d];
// 			text-name: @osm_icon;
// 	// text-size: 14 + [ele] * 0.00001;
// 			text-size: linear([view::zoom], (7, 6), (15, 8))- 0.000001 * [rank]; 
// 			text-face-name: @osm;
// 			text-fill: @peak_label;
// 			text-feature-id: @featureId;
// 			// text-halo-fill: @halo_park_label;
// 			// text-feature-id: [ele];
// 			// text-halo-rasterizer: fast;
// 			// text-halo-radius: 1;
// 		// }
// 	}
// 	::label {
// 	// 	[zoom>=4][comment =~'.*Highest.*'],
// 	// [zoom>=4][comment =~'.*highest.*'],
// 	// [zoom>=7][ele>=4500],
// 	// [zoom>=8][ele>=3500],
// 	// [zoom>=9][ele>=2500],
// 	// [zoom>=10][ele>=2000],
// 	// [zoom>=11] {
// 		text-name: @name ?  ( [ele] ? [ele] + 'm' + '\n ' + @name : @name): '';
// 		text-face-name: @mont_md;
// 		text-size: linear([view::zoom], (6, 7), (11, 8), (14, 9))- 0.000001 * [rank]; 
// 		text-fill: darken(@peak_label, 5%);
// 		text-placement: [nuti::markers3d];
// 		text-halo-fill: @halo_park_label;
// 		text-feature-id: @featureId;
// 		text-halo-radius: 0.5;
// 		text-halo-rasterizer: fast;
// 		// text-feature-id: [ele];
// 		// text-allow-overlap: true;
// 		// text-wrap-before: true;
// 		text-wrap-width: step([zoom], (11, 40), (15, 70), (16, 90), (18, 100));
// 		// text-line-spacing:	-2;
// 		text-dy: 10;
// 		// text-min-distance: 3000;
// 		// }
		
// 	// }
// 	}
// }
 

#building['nuti::buildings'>0][name!=null][zoom>=17]{
	text-name: [name];
	text-face-name: @mont;
	text-fill: @housenumber;
	text-halo-rasterizer: fast;
	text-line-spacing: -1;
	text-wrap-width: 60;
	text-wrap-before: true;
	text-avoid-edges: true;
	// text-transform: uppercase;
	text-size: linear([view::zoom], (16, 6.0), (18, 8.0), (20, 10.0));
	text-min-distance: linear([view::zoom], (16, 100.0), (17, 50), (18, 20.0));
}
// biais
#housenumber[zoom>=18]{
	text-name: [housenumber];
	text-face-name: @mont;
	text-fill: @housename;
	text-size: linear([view::zoom], (17, 9), (18, 11));
	// text-dy:14;
		// text-allow-overlap: true;
		text-avoid-edges: true;
	text-min-distance: linear([view::zoom], (17, 100), (18, 50), (19, 20));

}

#aerodrome_label[zoom>=15] {
	text-name: @name;
	text-face-name: @mont;
	text-fill: @building_label;
	text-size: 9;
	text-wrap-width: 100;
}
// #aeroway[zoom>=15][ref!=null] {
// 	text-name: [ref];
// 	text-face-name: @mont;
// 	text-fill: @building_label;
// 	text-size: 9;
// }


// #transportation[name!=null][class=rail] {
// 	/* Mostly started from z17. */
// 	[subclass=rail],
// 	[subclass=subway],
// 	[subclass=narrow_gauge],
// 	[subclass=light_rail],
// 	[subclass=preserved],
// 	[subclass=funicular],
// 	[subclass=monorail],
// 	[subclass=tram] {
// 		[zoom>=17] {
// 			text-name: @name;
// 			text-fill: #666666;
// 			text-size: 10;
// 			text-dy: 6;
// 			text-spacing: 900;
// 			text-clip: false;
// 			text-placement: line;
// 			text-face-name: @book-fonts;
// 			text-halo-radius: @standard-halo-radius;
// 			text-halo-fill: @standard-halo-fill;
// 			text-min-distance: @railway-text-repeat-distance;
// 		}
// 		[zoom>=19] {
// 			text-size: 11;
// 			text-dy: 7;
// 		}
// 	}
// 	[subclass=rail] {
// 	/* Render highspeed rails from z11,
// 		 other main routes at z14. */
// 		[highspeed=yes] {
// 			[zoom>=11] {
// 			text-name: @name;
// 			text-fill: #666666;
// 			text-size: 10;
// 			text-dy: 3;
// 			text-spacing: 300;
// 			text-clip: false;
// 			text-placement: line;
// 			text-face-name: @book-fonts;
// 			text-halo-radius: @standard-halo-radius;
// 			text-halo-fill: @standard-halo-fill;
// 			text-min-distance: @railway-text-repeat-distance;
// 			}
// 			[zoom>=13] {
// 			text-dy: 6;
// 			}
// 			[zoom>=14] {
// 			text-spacing: 600;
// 			}
// 			[zoom>=17] {
// 			text-size: 11;
// 			text-dy: 7;
// 			}
// 			[zoom>=19] {
// 			text-size: 12;
// 			text-dy: 8;
// 			}
// 		}
// 		[highspeed != yes][usage=main] {
// 			[zoom>=14] {
// 				text-name: @name;
// 				text-fill: #666666;
// 				text-size: 10;
// 				text-dy: 6;
// 				text-spacing: 300;
// 				text-clip: false;
// 				text-placement: line;
// 				text-face-name: @book-fonts;
// 				text-halo-radius: @standard-halo-radius;
// 				text-halo-fill: @standard-halo-fill;
// 				text-min-distance: @railway-text-repeat-distance;
// 			}
// 			[zoom>=17] {
// 				text-spacing: 600;
// 				text-size: 11;
// 				text-dy: 7;
// 			}
// 			[zoom>=19] {
// 				text-size: 12;
// 				text-dy: 8;
// 			}
// 		}
// 	}
// 	/* Other minor railway styles. For service rails, see:
// 	 https://github.com/gravitystorm/openstreetmap-carto/pull/2687 */
// 	[subclass=preserved][zoom>=17] ,
// 	[subclass=miniature][zoom>=17] ,
// 	[subclass=disused][zoom>=17] ,
// 	[subclass=construction][zoom>=17]  {
// 		text-name: @name;
// 		text-fill: #666666;
// 		text-size: 10;
// 		text-dy: 6;
// 		text-spacing: 900;
// 		text-clip: false;
// 		text-placement: line;
// 		text-face-name: @book-fonts;
// 		text-halo-radius: @standard-halo-radius;
// 		text-halo-fill: @standard-halo-fill;
// 		text-min-distance: @railway-text-repeat-distance;
// 		[zoom>=19] {
// 			text-size: 11;
// 			text-dy: 7;
// 		}
// 	}
// }

