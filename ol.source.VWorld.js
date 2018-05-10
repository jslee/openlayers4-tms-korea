/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @classdesc
 * Layer source for the VWorldMap tile server.
 *
 * @constructor
 * @extends {ol.source.XYZ}
 * @param {olx.source.VWorldOptions=} opt_options VWorld Map options.
 * @api
 */

ol.source.VWorld = function (opt_options) {
    var options = opt_options || {};

    var url;

    switch (options.type) {
        case ol.source.VWorld.Types.Hybrid:
            url = "http://xdworld.vworld.kr:8080/2d/Hybrid/201710/{z}/{x}/{y}.png";
            break;
        case ol.source.VWorld.Types.Satellite:
            url = "http://xdworld.vworld.kr:8080/2d/Satellite/201710/{z}/{x}/{y}.jpeg";               
            break;
        case ol.source.VWorld.Types.Gray:
            url = "http://xdworld.vworld.kr:8080/2d/gray/201612/{z}/{x}/{y}.png";               
            break;
        default:
            url = "http://xdworld.vworld.kr:8080/2d/Base/201710/{z}/{x}/{y}.png";
            break;
    }

    ol.source.XYZ.call(this, {
        url: url,
        attributions: [
            new ol.Attribution({
                html: [ol.source.VWorld.ATTRIBUTION]
            })
        ]
    });
};

ol.inherits(ol.source.VWorld, ol.source.XYZ);

ol.source.VWorld.Types = {
    Street : 0,
    Hybrid: 1,
    Satellite: 2,
    Gray: 3
};

/**
 * The attribution containing a link to the VWorldMap Copyright and License
 * page.
 * @const
 * @type {string}
 * @api
 */
ol.source.VWorld.ATTRIBUTION = '&copy; '
    + '<a target="_blank" href="http://map.vworld.kr/" '
    + 'style="float: left; width: 353px; height: 29px; cursor: pointer; ' 
    + 'background-image: url(http://map.vworld.kr/images/maps/logo_openplatform.png); ' 
    + 'background-repeat: no-repeat no-repeat; " '
    + 'title="VWorld 지도로 보시려면 클릭하세요."></a>';

