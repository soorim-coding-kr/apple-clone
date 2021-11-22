(() => {
	let yOffset = 0; // = window.pageYOffset
	let prevScrollHeight = 0; //현재 스크롤 위치(=yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0; // 현재 활성화된(눈앞에 보이는) 스크롤 섹션
	let enterNewScene = false; // 새로운 섹션이 시작되는 순간 = currentScene이 바뀌는 순간 true //섹션이 변경될 때 scrollRatio 음수가 나오지 않게 하기 위함

	const sceneInfo = [
		{
			// scroll-section-0
			//각 구간의 스크롤 전체 height
			type: 'sticky',
			heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				messageD: document.querySelector('#scroll-section-0 .main-message.d'),
				// 캔버스 요소 선택
				canvas: document.querySelector('#video-canvas-0'),
				// 드로잉 객체 생성
				context: document.querySelector('#video-canvas-0').getContext('2d'),
				// 이미지 시쿼스를 담을 배열
				videoImages: [],
			},
			values: {
				// 캔버스에서 변경되어야 할 이미지 시퀀스 설정 (이미지 순서). 이미지 갯수에 따라 설정
				// 이미지 갯수 설정
				videoImageCount: 300,
				// 이미지 순서의 초기값, 최종값 설정
				ImageSequence: [0, 299],
				// 캔버스 스크롤 끝날 때 쯤 fade out 효과
				canvas_opacity: [1, 0, { start: 0.95, end: 1 }],
				// start, end = 애니메이션이 재생되는 구간 설정 (비율기준)
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
				// messegaA_translateY: [-20, 0],
			},
		},
		{
			// scroll-section-1
			type: 'normal',
			// heightNum: 5, // type normal에서는 필요없음.
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-1'),
			},
		},
		{
			// scroll-section-2
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-2'),
				messageA: document.querySelector('#scroll-section-2 .a'),
				messageB: document.querySelector('#scroll-section-2 .b'),
				messageC: document.querySelector('#scroll-section-2 .c'),
				pinB: document.querySelector('#scroll-section-2 .b .pin'),
				pinC: document.querySelector('#scroll-section-2 .c .pin'),
				canvas: document.querySelector('#video-canvas-1'),
				context: document.querySelector('#video-canvas-1').getContext('2d'),
				videoImages: [],
			},
			values: {
				videoImageCount: 960,
				ImageSequence: [0, 959],
				canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
				canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
				messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
				messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
				messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
				messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
				messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
				messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
				messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
				messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
				messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
				messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
				messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
				pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
				pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
				pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
				pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
				pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
			},
		},
		{
			// scroll-section-3
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-3'),
				canvasCaption: document.querySelector('.canvas-caption'),
				canvas: document.querySelector('.image-blend-canvas'),
				context: document.querySelector('.image-blend-canvas').getContext('2d'),
				imagesPath: [
					'./images/blend-image-1.jpg',
					'./images/blend-image-2.jpg',
				],
				images: [],
			},
			values: {
				rect1X: [0, 0, { start: 0, end: 0 }],
				rect2X: [0, 0, { start: 0, end: 0 }],
				rectStartY: 0,
			},
		},
	];

	// 이미지 objs.videoImages[]에 세팅
	function setCanvasImages() {
		let imgElem;
		for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
			imgElem = new Image();
			//  = imgElem = document.createElement('img')
			imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
			// 위의 src를 가진 imgElem 객체 생성 후 videoImages배열에 추가
			sceneInfo[0].objs.videoImages.push(imgElem);
		}
		// console.log(sceneInfo[0].objs.videoImages);

		let imgElem2;
		for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
			imgElem2 = new Image();
			imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
			sceneInfo[2].objs.videoImages.push(imgElem2);
		}

		let imgElem3;
		for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
			imgElem3 = new Image();
			imgElem3.src = sceneInfo[3].objs.imagesPath[i];
			sceneInfo[3].objs.images.push(imgElem3);
		}
		// console.log(sceneInfo[3].objs.images);
	}
	setCanvasImages();

	function setLayout() {
		//각 스크롤 섹션의 높이 세팅
		for (let i = 0; i < sceneInfo.length; i++) {
			if (sceneInfo[i].type === 'sticky') {
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			} else if (sceneInfo[i].type === 'normal') {
				sceneInfo[i].scrollHeight = sceneInfo[i].scrollHeight =
					sceneInfo[i].objs.container.offsetHeight;
			}
			sceneInfo[
				i
			].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
		}
		// console.log(sceneInfo);
		// setLayout에서 currentScene 세팅 (브라우저 새로고침 시에도 currentScene 맞추기 위함)
		yOffset = window.pageYOffset;
		let totalScrollHeight = 0;
		for (let i = 0; i < sceneInfo.length; i++) {
			// 각 씬의 스크롤높이값을 계속 더해줌
			totalScrollHeight += sceneInfo[i].scrollHeight;
			// 전체 스크롤 높이가 현재 스크롤 높이보다 작으면
			if (totalScrollHeight >= yOffset) {
				// 현재 씬을 currentScene으로 세팅하고 for문 멈춤
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`);
		//  캔버스가 가진 픽셀 수를 유지한 채 scale을 조절하는것이 성능에 더 좋기때문에 이곳에서 canvas크기 세팅
		// 캔버스 대비 윈도우 창의 비율.
		const heightRatio = window.innerHeight / 1080;
		sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
		sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
	}
	// 변화의 시작,끝값 = sceneInfo 의 values
	function calcValues(values, currentYOffset) {
		let rv;
		//현재 섹션을 기준으로 현재 스크롤 위치값에 따른 비율
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;

		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;
			if (
				currentYOffset >= partScrollStart &&
				currentYOffset <= partScrollEnd
			) {
				// currentYOffset 의 스크롤값이 partScroll 범위 내에  들어와 있으면
				rv =
					((currentYOffset - partScrollStart) / partScrollHeight) *
						(values[1] - values[0]) +
					values[0];
			} else if (currentYOffset < partScrollStart) {
				// currentYOffset의 스크롤 값이 start구간에 못미치면 rv=초기값
				rv = values[0];
			} else if (currentYOffset > partScrollEnd) {
				// currentYOffset의 스크롤 값이 end 구간 이후로 범위보다 스크롤값이 더 크면  rv=최종값
				rv = values[1];
			}
		} else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return rv;
	}

	// 섹션 별 애니메이션 세팅 (보여지는 섹션에서만 구현되도록 위함)
	function playAnimation() {
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		// currentYOffset = 현재 섹션의 top 0 위치로부터 얼만큼 스크롤이 되었는지
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		// console.log(currentScene, currentYOffset);
		// console.log(currentScene);
		switch (currentScene) {
			case 0:
				///////// 캔버스 드로잉
				// 섹션이 시작할 때 부터 끝날 때 까지 쭉 재생되게.
				let sequence = Math.round(
					calcValues(values.ImageSequence, currentYOffset)
				);
				// console.log(sequence);
				//  setCanvasImages()에서 objs.videoImages[]에 넣어준 이미지 적용 후 스크롤
				// setCanvasImages()에서 설정해 준 videoImages 객체 적용 sequence번째 이미지 드로우
				objs.context.drawImage(objs.videoImages[sequence], 0, 0);
				// (videoImages[그릴 이미지 객체], x좌표, y좌표, width, height); width, height는 생략

				// 마지막 canvas fade out효과
				objs.canvas.style.opacity = calcValues(
					values.canvas_opacity,
					currentYOffset
				);
				// console.log('0 play;');
				/////////////////// 텍스트 효과
				if (scrollRatio <= 0.22) {
					objs.messageA.style.opacity = calcValues(
						values.messageA_opacity_in,
						currentYOffset
					);
					objs.messageA.style.transform = `translateY(${calcValues(
						values.messageA_translateY_in,
						currentYOffset
					)}%)`;
				} else {
					objs.messageA.style.opacity = calcValues(
						values.messageA_opacity_out,
						currentYOffset
					);
					objs.messageA.style.transform = `translateY(${calcValues(
						values.messageA_translateY_out,
						currentYOffset
					)}%)`;
				}
				// console.log(messageA_opacity_in);
				// console.log(calcValues(values.messageA_opacity_in, currentYOffset));
				if (scrollRatio <= 0.42) {
					const messageB_opacity_in = calcValues(
						values.messageB_opacity_in,
						currentYOffset
					);
					const messageB_translateY_in = calcValues(
						values.messageB_translateY_in,
						currentYOffset
					);
					objs.messageB.style.opacity = messageB_opacity_in;
					objs.messageB.style.transform = `translateY(${messageB_translateY_in}%)`;
				} else {
					const messageB_opacity_out = calcValues(
						values.messageB_opacity_out,
						currentYOffset
					);
					const messageB_translateY_out = calcValues(
						values.messageB_translateY_out,
						currentYOffset
					);
					objs.messageB.style.opacity = messageB_opacity_out;
					objs.messageB.style.transform = `translateY(${messageB_translateY_out}%)`;
				}
				if (scrollRatio <= 0.62) {
					const messageC_opacity_in = calcValues(
						values.messageC_opacity_in,
						currentYOffset
					);
					const messageC_translateY_in = calcValues(
						values.messageC_translateY_in,
						currentYOffset
					);
					objs.messageC.style.opacity = messageC_opacity_in;
					objs.messageC.style.transform = `translateY(${messageC_translateY_in}%)`;
				} else {
					const messageC_opacity_out = calcValues(
						values.messageC_opacity_out,
						currentYOffset
					);
					const messageC_translateY_out = calcValues(
						values.messageC_translateY_out,
						currentYOffset
					);
					objs.messageC.style.opacity = messageC_opacity_out;
					objs.messageC.style.transform = `translateY(${messageC_translateY_out}%)`;
				}
				if (scrollRatio <= 0.82) {
					const messageD_opacity_in = calcValues(
						values.messageD_opacity_in,
						currentYOffset
					);
					const messageD_translateY_in = calcValues(
						values.messageD_translateY_in,
						currentYOffset
					);
					objs.messageD.style.opacity = messageD_opacity_in;
					objs.messageD.style.transform = `translateY(${messageD_translateY_in}%)`;
				} else {
					const messageD_opacity_out = calcValues(
						values.messageD_opacity_out,
						currentYOffset
					);
					const messageD_translateY_out = calcValues(
						values.messageD_translateY_out,
						currentYOffset
					);
					objs.messageD.style.opacity = messageD_opacity_out;
					objs.messageD.style.transform = `translateY(${messageD_translateY_out}%)`;
				}

				break;
			case 1:
				// console.log('1 play;');

				break;
			case 2:
				// console.log('2 play;');
				let sequence2 = Math.round(
					calcValues(values.ImageSequence, currentYOffset)
				);
				objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

				if (scrollRatio <= 0.5) {
					objs.canvas.style.opacity = calcValues(
						values.canvas_opacity_in,
						currentYOffset
					);
				} else {
					objs.canvas.style.opacity = calcValues(
						values.canvas_opacity_out,
						currentYOffset
					);
				}
				if (scrollRatio <= 0.32) {
					// in
					objs.messageA.style.opacity = calcValues(
						values.messageA_opacity_in,
						currentYOffset
					);
					// translate3d 처럼 3d가 붙은 속성들은 하드웨어 가속이 보장되어 더 나은 퍼포먼스. 실제 apple에서도 z축이 변함없는 효과여도 3d를 사용하여 작성.
					objs.messageA.style.transform = `translate3d(0, ${calcValues(
						values.messageA_translateY_in,
						currentYOffset
					)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(
						values.messageA_opacity_out,
						currentYOffset
					);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(
						values.messageA_translateY_out,
						currentYOffset
					)}%, 0)`;
				}

				if (scrollRatio <= 0.67) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(
						values.messageB_translateY_in,
						currentYOffset
					)}%, 0)`;
					objs.messageB.style.opacity = calcValues(
						values.messageB_opacity_in,
						currentYOffset
					);
					objs.pinB.style.transform = `scaleY(${calcValues(
						values.pinB_scaleY,
						currentYOffset
					)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(
						values.messageB_translateY_out,
						currentYOffset
					)}%, 0)`;
					objs.messageB.style.opacity = calcValues(
						values.messageB_opacity_out,
						currentYOffset
					);
					objs.pinB.style.transform = `scaleY(${calcValues(
						values.pinB_scaleY,
						currentYOffset
					)})`;
				}

				if (scrollRatio <= 0.93) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(
						values.messageC_translateY_in,
						currentYOffset
					)}%, 0)`;
					objs.messageC.style.opacity = calcValues(
						values.messageC_opacity_in,
						currentYOffset
					);
					objs.pinC.style.transform = `scaleY(${calcValues(
						values.pinC_scaleY,
						currentYOffset
					)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(
						values.messageC_translateY_out,
						currentYOffset
					)}%, 0)`;
					objs.messageC.style.opacity = calcValues(
						values.messageC_opacity_out,
						currentYOffset
					);
					objs.pinC.style.transform = `scaleY(${calcValues(
						values.pinC_scaleY,
						currentYOffset
					)})`;
				}

				break;
			case 3:
				// console.log('3 play;');
				// 가로/세로 전부 꽉 차게 하기 위한 세팅(계산)
				const widthRatio = window.innerWidth / objs.canvas.width;
				const heightRatio = window.innerHeight / objs.canvas.height;
				// console.log(`w=${widthRatio} , h= ${heightRatio}`);
				let canvasScaleRatio;
				if (widthRatio <= heightRatio) {
					// 캔버스보다 브라우저 창이 홀쭉한 경우
					canvasScaleRatio = heightRatio;
					// console.log('기준 : heightRatio');
				} else {
					// 캔버스보다 브라우저 창이 납작한 경우
					canvasScaleRatio = widthRatio;
					// console.log('기준 : widthRatio');
				}

				objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
				objs.context.drawImage(objs.images[0], 0, 0);

				//캔버스 사이즈에 맞춰 innerWidth, innerHeight 세팅
				// const recalculatedInnerWidth = window.innerWidth / canvasScaleRatio;
				// const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
				// 스크롤바 너비까지 포함되기 때문에 window.innerWidth -> body.offsetWidth
				const recalculatedInnerWidth =
					document.body.offsetWidth / canvasScaleRatio;
				const recalculatedInnerHeight =
					document.body.offsetWidth / canvasScaleRatio;

				// 캔버스 위치,크기 가져오기
				if (!values.rectStartY) {
					values.rectStartY = objs.canvas.getBoundingClientRect().top;
					console.log(values.rectStartY);
					// values.rect1X[2].start = window.innerHeight / 2 / scrollHeight;
					// values.rect2X[2].start = window.innerHeight / 2 / scrollHeight;
					values.rect1X[2].end = values.rectStartY / scrollHeight;
					values.rect2X[2].end = values.rectStartY / scrollHeight;
				}

				// canvas 흰색박스 크기
				const whiteRectWidth = recalculatedInnerWidth * 0.15;
				// canvas 흰색박스 (왼쪽박스, 오른쪽박스) 위치값 세팅
				values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
				values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
				values.rect2X[0] =
					values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
				values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

				// console.log('3 Start');

				//.좌우 흰색 박스,
				// objs.context.fillRect(
				// 	values.rect1X[0],
				// 	0,
				// 	parseInt(whiteRectWidth),
				// 	objs.canvas.height
				// );
				// // canvas에서는 정수처리가 되어야 성능이 좀 더 좋아지기 때문에 parseInt()로 정수처리
				// objs.context.fillRect(
				// 	values.rect2X[0],
				// 	0,
				// 	parseInt(whiteRectWidth),
				// 	objs.canvas.height
				// );
				objs.context.fillRect(
					parseInt(calcValues(values.rect1X, currentYOffset)),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
				);
				objs.context.fillRect(
					parseInt(calcValues(values.rect2X, currentYOffset)),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
				);

				// console.log(`w=${recalculatedInnerWidth} h=${recalculatedInnerHeight}`);
				break;
		}
	}

	// 몇번째 스크롤 섹션에서 애니메이션을 활성화 시킬지
	function scrollLoop() {
		enterNewScene = false; // 스크롤 시 기본 false 세팅
		prevScrollHeight = 0;
		for (let i = 0; i < currentScene; i++) {
			// prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
			// prevScrollHeight += sceneInfo[i].scrollHeight;
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}
		if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true; // 씬이 변경될 때 true로 변경
			currentScene++;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}
		if (yOffset < prevScrollHeight) {
			enterNewScene = true;
			if (currentScene === 0) return; // 브라우저 바운스 효과로 마이너스가 되는 것을 방지
			currentScene--;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}
		// console.log(prevScrollHeight);
		// console.log(currentScene);

		//스크롤에 따라 값을 반영하는 함수가 playAnimation 이기 때문에 enterNewScene이 ture일때는  playAnimation을 실행하기 전에 return으로 강제종료
		if (enterNewScene) return;
		playAnimation();
	}

	window.addEventListener('scroll', () => {
		yOffset = window.pageYOffset;
		scrollLoop();
	});
	// window.addEventListener('DOMContentLoaded', setLayout);
	window.addEventListener('load', () => {
		setLayout();
		// 스크롤을 하기 전에 첫번째 이미지 그려줌
		sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
	});
	window.addEventListener('resize', setLayout);
})();
