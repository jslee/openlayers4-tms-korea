/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @classdesc
 * Layer source for the NaverMap tile server.
 *
 * @constructor
 * @extends {ol.source.XYZ}
 * @param {olx.source.NaverOptions=} opt_options Naver Map options.
 * @api
 */

proj4.defs("EPSG:5179", '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs');

String.prototype.format = function () {
    var a = this;
    for (var k in arguments)
        a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    return a;
}

ol.source.Naver = function (opt_options) {
    var options = opt_options || {};

    var resolutions = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
    var extent = [90112, 1192896, 2187264, 2765760];
    var projection = new ol.proj.Projection({
        code: 'EPSG:5179',
        extent: extent,
        units: 'm'
    });

    var url;

    switch (options.type) {
        case ol.source.Naver.Types.Cadstral:
            url = "https://simg.pstatic.net/onetile/get/180/0/0/{0}/{1}/{2}/empty/ol_lp_cn";
            break;
        case ol.source.Naver.Types.Hybrid:
            url = "https://simg.pstatic.net/onetile/get/180/0/0/{0}/{1}/{2}/empty/ol_st_rd/ol_st_an";
            break;
        case ol.source.Naver.Types.Satellite:
            url = "https://simg.pstatic.net/onetile/get/180/0/1/{0}/{1}/{2}/bl_st_bg";
            break;
        case ol.source.Naver.Types.Physical:
            url = "https://simg.pstatic.net/onetile/get/180/0/0/{0}/{1}/{2}/bl_tn_bg/ol_vc_bg/ol_vc_an";
            break;
        default:
            url = 'https://simg.pstatic.net/onetile/get/180/0/0/{0}/{1}/{2}/bl_vc_bg/ol_vc_an';
            break;
    }

    ol.source.XYZ.call(this, {
        projection: projection,
        minZoom: 0,
        maxZoom: resolutions.length - 1,
        tileGrid: new ol.tilegrid.TileGrid({
            extent: extent,
            origin: [extent[0], extent[1]],
            resolutions: resolutions
        }),
        tileUrlFunction: function (tileCoord, pixelRatio, projection) {
            if (tileCoord == null) return undefined;

            var z = tileCoord[0] + 1;
            var x = tileCoord[1];
            var y = tileCoord[2];

            return url.format(z, x, y);
        },
        attributions: [
            new ol.Attribution({
                html: [ol.source.Naver.ATTRIBUTION]
            })
        ]
    });
};

ol.inherits(ol.source.Naver, ol.source.XYZ);

ol.source.Naver.Types = {
    Street : 0,
    Cadstral : 1,
    Hybrid: 2,
    Satellite: 3,
    Physical: 4
};

/**
 * The attribution containing a link to the NaverMap Copyright and License
 * page.
 * @const
 * @type {string}
 * @api
 */
ol.source.Naver.ATTRIBUTION = '&copy; '
    + '<a href="http://www.nhncorp.com" target="_blank" style="text-decoration: none !important;">'
    + '<span style="display: inline; font-family: Tahoma,sans-serif !important; font-size: 9px !important; font-weight: bold !important; font-style: normal !important; color: #009BC8 !important; text-decoration: none !important;">'
    + 'NHN Corp.</span></a>'
    + '<img class="nmap_logo_map" src="http://static.naver.net/maps2/logo_naver_s.png" width="43" height="9" alt="NAVER">';

