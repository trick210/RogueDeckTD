let cannonBlastParticles = {
					"lifetime": {
						"min": 0.3,
						"max": 0.3
					},
					"frequency": 0.001,
					"emitterLifetime": 0.2,
					"maxParticles": 1000,
					"addAtBack": false,
					"pos": {
						"x": 0,
						"y": 0
					},
					"behaviors": [
						{
							"type": "alpha",
							"config": {
								"alpha": {
									"list": [
										{
											"time": 0,
											"value": 0.5
										},
										{
											"time": 1,
											"value": 0.1
										}
									]
								}
							}
						},
						{
							"type": "moveSpeed",
							"config": {
								"speed": {
									"list": [
										{
											"time": 0,
											"value": 800
										},
										{
											"time": 1,
											"value": 200
										}
									]
								}
							}
						},
						{
							"type": "scale",
							"config": {
								"scale": {
									"list": [
										{
											"time": 0,
											"value": 1
										},
										{
											"time": 1,
											"value": 0.5
										}
									]
								},
								"minMult": 1
							}
						},
						{
							"type": "color",
							"config": {
								"color": {
									"list": [
										{
											"time": 0,
											"value": "87ebfa"
										},
										{
											"time": 1,
											"value": "262dfc"
										}
									]
								}
							}
						},
						{
							"type": "rotationStatic",
							"config": {
								"min": 0,
								"max": 360
							}
						},
						{
							"type": "textureRandom",
							"config": {
								"textures": [
									"particle"
								]
							}
						},
						{
							"type": "spawnShape",
							"config": {
								"type": "circle",
								"data": {
									"x": 0,
									"y": 0,
									"radius": 0,
									"innerRadius": 0,
									"affectRotation": false
								}
							}
						}
					]
				}