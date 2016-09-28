(function(){
	"use strict";
});

var cp = require("child_process");

function getNextFile() {
	var cmd = "git status -s";
	console.log(cmd);

	return new Promise(function(resolve, reject) {
		cp.exec(cmd, [], function (error, stdout, stderr) {
			if (error) {
				reject(error);
			} else {
				lines = stdout.split("\n");
				console.log("\t(" + lines.length + ")");
				if (lines.length >= 0) {
					var line = lines[0];
					var parts = line.split(" ");
					if (parts.length >= 2) {
						resolve(parts[1]);
					} else {
						resolve(null);
					}
				} else {
				   resolve(null);
				}
			}
		});
	});
}

function gitAdd(filename) {
	var cmd = "git add '" + filename + "'";
	console.log(cmd);

	return new Promise(function (resolve, reject) {
		cp.exec(cmd, [], function (error, stdout, stderr) {
			if (error) {
				reject (error);
			} else {
				resolve(null);
			}
		});
	});
}

function gitCommit(filename) {
	var cmd = "git commit -m 'Added " + filename + "'";
	console.log(cmd);

	return new Promise(function (resolve, reject) {
		cp.exec(cmd, [], function (error, stdout, stderr) {
			if (error) {
				reject (error);
			} else {
				resolve(null);
			}
		});
	});
}

function gitPush() {
	var cmd = "git push origin master";
	console.log(cmd);

	return new Promise(function (resolve, reject) {
		cp.exec(cmd, [], function (error, stdout, stderr) {
			if (error) {
				reject (error);
			} else {
				resolve(null);
			}
		});
	});
}

function processFiles (resolve, reject) {
	if (!resolve) {
		return new Promise(function (_resolve, _reject) {
			processFiles (_resolve, _reject);
		});
	} else {
		getNextFile()

		.then(function(filename) {
			if (filename) {
				gitAdd(filename)

				.then(function() {
					gitCommit(filename)

					.then(function() {
						gitPush()

						.then(function () {
							processFiles(resolve, reject);
						})

						.catch(function(err1) {
							reject(err1);
						});
					})

					.catch(function(err2) {
						reject(err2);
					});
				})

				.catch(function(err3) {
					reject(err3);
				});
			} else {
				resolve();
			}
		})

		.catch(function(err4) {
			reject(err4);
		});
	}
}

function main() {
	processFiles ()

	.then(function() {
		console.log("Done");
		process.exit(0);
	})

	.catch(function(error) {
		console.error(error);
		process.exit(1);
	});
}

main();
