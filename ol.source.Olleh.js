/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

proj4.defs("EPSG:5179", '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs');

String.prototype.format = function () {
    var a = this;
    for (var k in arguments)
        a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    return a;
}

ol.source.Olleh = function (opt_options) {
    var options = opt_options || {};

    var resolutions = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5];
    var extent = [171162, 1214781, 1744026, 2787645];
    var projection = new ol.proj.Projection({
        code: 'EPSG:5179',
        extent: extent,
        units: 'm'
    });

    var url;

    switch (options.type) {
        case ol.source.Olleh.Types.Cadstral:
            url = "http://map.ktgis.com/CadastralMap/cadastral4.04.1_0527/layers/_alllayers/l{0}/r{1}/c{2}.png";               
            break;
        case ol.source.Olleh.Types.Hybrid:
            url = "http://map.ktgis.com/HybridMap/olleh6.03.1_0405_hyb/layers/_alllayers/l{0}/r{1}/c{2}.png";
            break;
        case ol.source.Olleh.Types.Satellite:
            url = "http://map.ktgis.com/ServiceAir/version20110705/l{0}/r{1}/c{2}.jpg";               
            break;
        case ol.source.Olleh.Types.Physical:
            url = "http://map.ktgis.com/HybridMap/3d130924/layers/_alllayers/l{0}/r{1}/c{2}.png";               
            break;
        default:
            url = "http://map.ktgis.com/BaseMap/olleh7.10.1_1027/layers/_alllayers/l{0}/r{1}/c{2}.png";
            break;
    }

    ol.source.XYZ.call(this, {
        projection: projection,
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

            var res = resolutions[z];
            var tileSize = this.tileGrid.getTileSize();
            var rows = Math.floor((extent[3] - extent[1]) / (res * tileSize));

            var sz = new String(z);
            var uz = sz;
        
            if (sz.length == 1)
                uz = '0' + sz;
        
            var sx = parseInt(x).toString(16);
            var ux = sx;
        
            if (sx.length == 1) 
                ux = '0000000' + sx;
            else if (sx.length == 2) 
                ux = '000000' + sx;
            else if (sx.length == 3) 
                ux = '00000' + sx;
            else if (sx.length == 4) 
                ux = '0000' + sx;
            else if (sx.length == 5) 
               ux = '000' + sx;
            else if (sx.length == 6) 
                ux = '00' + sx;
            else if (sx.length == 7) 
                ux = '0' + sx;
        
            var sy = parseInt(rows - y - 1).toString(16);
            var uy = sy;
        
            if (sy.length == 1) 
                uy = '0000000' + sy;
            else if (sy.length == 2) 
                uy = '000000' + sy;
            else if (sy.length == 3) 
                uy = '00000' + sy;
            else if (sy.length == 4) 
                uy = '0000' + sy;
            else if (sy.length == 5) 
                uy = '000' + sy;
            else if (sy.length == 6) 
                uy = '00' + sy;
            else if (sy.length == 7) 
                uy = '0' + sy;

            return url.format(uz, uy, ux);
        },
        attributions: [
            new ol.Attribution({
                html: [ol.source.Olleh.ATTRIBUTION]
            })
        ]
    });
};

ol.inherits(ol.source.Olleh, ol.source.XYZ);

ol.source.Olleh.Types = {
    Street : 0,
    Cadstral : 1,
    Hybrid: 2,
    Satellite: 3,
    Physical: 4
};

ol.source.Olleh.ATTRIBUTION = '&copy; '
    + '<a target="_blank" href="http://map.olleh.com" '
    + 'style="float: left; width: 45px; height: 16px; cursor: pointer; ' 
    + 'background-image: url(http://i.kthimg.com/TOP/svc/map/v3_olleh/js/kmap/images/2D_BI_olleh.png); ' 
    + 'background-repeat: no-repeat no-repeat; " '
    + 'title="Olleh 지도로 보시려면 클릭하세요."></a>' 
    + 'Olleh';

