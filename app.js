(function() {
	var heatmap;
	var heatmapDecay = 250;
	var heatmapPointSize = 6;
	var heatmapPointIntensity = 20 / 255;
	var heatmapCanvas = document.getElementById('heatmap');
	var capturing = false;

	camera.init({
		width: 800,
		height: 600,
		fps: 30,
		mirror: true,
		onFrame: function(canvas) {
			if (heatmap) {
				movement.fromCanvas(canvas, {
					callback: function(updateList) {
						for (var i = 0; i < updateList.length; i++) {
							heatmap.addPoint(updateList[i].x * 2, updateList[i].y * 2, heatmapPointSize, heatmapPointIntensity);
						}
					}
				});

				heatmap.update();
				heatmap.multiply(1 - heatmapDecay / (100 * 100));
				heatmap.display();
			}
		},

		onSuccess: function() {
			document.getElementById("info").style.display = "none";

			const button = document.getElementById("button");
			button.style.display = "block";
			button.onclick = function() {
				if (capturing) {
					camera.pause();
					button.innerText = 'resume';
				} else {
					camera.start();
					button.innerText = 'pause';
				}
				capturing = !capturing;
			};

			try {
				heatmap = createWebGLHeatmap({
					canvas: heatmapCanvas
				});
			} catch (exception) {
				camera.stop();
				heatmapCanvas.style.display = "none";
				document.getElementById("webGLNotSupported").style.display = "block";
			}
		},

		onError: function(error) {
		},

		onNotSupported: function() {
			document.getElementById("info").style.display = "none";
			heatmapCanvas.style.display = "none";
			document.getElementById("cameraNotSupported").style.display = "block";
		}
	});
})();
