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
			},
			values: {
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
			},
			values: {
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
			},
			values: {},
		},
	];

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
				// console.log('0 play;');
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
				if (scrollRatio <= 0.32) {
					// in
					objs.messageA.style.opacity = calcValues(
						values.messageA_opacity_in,
						currentYOffset
					);
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
	window.addEventListener('load', setLayout);
	window.addEventListener('resize', setLayout);
})();
