/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @classdesc
 * Layer source for the RenderManMap tile server.
 *
 * @constructor
 * @extends {ol.source.XYZ}
 * @param {olx.source.RenderManOptions=} opt_options RenderMan Map options.
 * @api
 */

String.prototype.format = function () {
    var a = this;
    for (var k in arguments)
        a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    return a;
}

ol.source.RenderMan = function (opt_options) {
    var options = opt_options || {};

    var resolutions = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125];
    var extent = [13775786.9824, 3757032.8128, 15028131.2536, 5009377.084];

    var url = "http://www.mosition.co.kr:8787/get.map?x={0}&y={1}&z={2}";

    ol.source.XYZ.call(this, {
        minZoom: 0,
        maxZoom: resolutions.length,
        tileGrid: new ol.tilegrid.TileGrid({
            extent: extent,
            origin: [extent[0], extent[1]],
            resolutions: resolutions
        }),
        tileUrlFunction: function (tileCoord, pixelRatio, projection) {
            if (tileCoord == null) return undefined;

            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            return url.format(x, y, z);
        },
        attributions: [
            new ol.Attribution({
                html: [ol.source.RenderMan.ATTRIBUTION]
            })
        ]
    });
};

ol.inherits(ol.source.RenderMan, ol.source.XYZ);

/**
 * The attribution containing a link to the RenderManMap Copyright and License
 * page.
 * @const
 * @type {string}
 * @api
 */
ol.source.RenderMan.ATTRIBUTION = '&copy; '
    + '<a target="_blank" href="http://www.mosition.co.kr" '
	+ 'style="float: left; width: 16px; height: 16px; cursor: pointer; ' 
    + 'background-image: url(http://www.mosition.co.kr/favicon.png); background-repeat: no-repeat no-repeat; " '
	+ 'title="Greetings by MOSITION"></a>'
	+ 'ⓒ 2012 MOSITION';

