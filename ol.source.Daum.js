/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @classdesc
 * Layer source for the DaumMap tile server.
 *
 * @constructor
 * @extends {ol.source.XYZ}
 * @param {olx.source.DaumOptions=} opt_options Daum Map options.
 * @api
 */

proj4.defs("EPSG:5181", '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs');

String.prototype.format = function () {
    var a = this;
    for (var k in arguments)
        a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    return a;
}

ol.source.Daum = function (opt_options) {
    var options = opt_options || {};

    var resolutions = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
    var extent = [-30000, -60000, 494288, 988576];  // 4 * 3
    var projection = new ol.proj.Projection({
        code: 'EPSG:5181',
        extent: extent,
        units: 'm'
    });

    var url;

    switch (options.type) {
        case ol.source.Daum.Types.Cadstral:
            url = [
                "http://map0.daumcdn.net/map_usedistrict/1711nov/L{0}/{1}/{2}.png",
                "http://map1.daumcdn.net/map_usedistrict/1711nov/L{0}/{1}/{2}.png",
                "http://map2.daumcdn.net/map_usedistrict/1711nov/L{0}/{1}/{2}.png",
                "http://map3.daumcdn.net/map_usedistrict/1711nov/L{0}/{1}/{2}.png"];               
            break;
        case ol.source.Daum.Types.Hybrid:
            url = [
                "http://map0.daumcdn.net/map_hybrid/1711nov/L{0}/{1}/{2}.png",
                "http://map1.daumcdn.net/map_hybrid/1711nov/L{0}/{1}/{2}.png",
                "http://map2.daumcdn.net/map_hybrid/1711nov/L{0}/{1}/{2}.png",
                "http://map3.daumcdn.net/map_hybrid/1711nov/L{0}/{1}/{2}.png"];               
            break;
        case ol.source.Daum.Types.Satellite:
            url = [
                "http://map0.daumcdn.net/map_skyview/L{0}/{1}/{2}.jpg?v=160107",
                "http://map1.daumcdn.net/map_skyview/L{0}/{1}/{2}.jpg?v=160107",
                "http://map2.daumcdn.net/map_skyview/L{0}/{1}/{2}.jpg?v=160107",
                "http://map3.daumcdn.net/map_skyview/L{0}/{1}/{2}.jpg?v=160107"];               
            break;
        case ol.source.Daum.Types.Physical:
            url = [
                "http://map0.daumcdn.net/map_shaded_relief/2.00/L{0}/{1}/{2}.png",
                "http://map1.daumcdn.net/map_shaded_relief/2.00/L{0}/{1}/{2}.png",
                "http://map2.daumcdn.net/map_shaded_relief/2.00/L{0}/{1}/{2}.png",
                "http://map3.daumcdn.net/map_shaded_relief/2.00/L{0}/{1}/{2}.png"];
            break;
        default:
            url = [
                "http://map0.daumcdn.net/map_2d/1711nov/L{0}/{1}/{2}.png",
                "http://map1.daumcdn.net/map_2d/1711nov/L{0}/{1}/{2}.png",
                "http://map2.daumcdn.net/map_2d/1711nov/L{0}/{1}/{2}.png",
                "http://map3.daumcdn.net/map_2d/1711nov/L{0}/{1}/{2}.png"
            ]
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

            var s = Math.floor(Math.random() * 4);  // 0 ~ 3
            var z = resolutions.length - tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            return url[s].format(z, y, x);
        },
        attributions: [
            new ol.Attribution({
                html: [ol.source.Daum.ATTRIBUTION]
            })
        ]
    });
};

ol.inherits(ol.source.Daum, ol.source.XYZ);

ol.source.Daum.Types = {
    Street : 0,
    Cadstral : 1,
    Hybrid: 2,
    Satellite: 3,
    Physical: 4
};

/**
 * The attribution containing a link to the DaumMap Copyright and License
 * page.
 * @const
 * @type {string}
 * @api
 */
ol.source.Daum.ATTRIBUTION = '&copy; '
    + '<a target="_blank" href="http://local.daum.net/map/index.jsp" '
    + 'style="float: left; width: 38px; height: 17px; cursor: pointer; '
    + 'background-image: url(http://i1.daumcdn.net/localimg/localimages/07/2008/map/n_local_img_03_b.png); '
    + 'background-repeat: no-repeat no-repeat; " '
    + 'title="Daum 지도로 보시려면 클릭하세요."></a>'
    + '2012 Daum';

