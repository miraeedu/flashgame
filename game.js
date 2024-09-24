var dragItems = document.querySelectorAll(".item");
var container = document.querySelector("#container");
var earthworm = document.getElementById("earthworm");
var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var dragItem; // 드래그 중인 아이템을 저장할 변수
var foodcounter = 0;

dragItems.forEach(item => {
    item.addEventListener("touchstart", dragStart, false);
    item.addEventListener("touchend", dragEnd, false);
    item.addEventListener("touchmove", drag, false);

    item.addEventListener("mousedown", dragStart, false);
    item.addEventListener("mouseup", dragEnd, false);
    item.addEventListener("mousemove", drag, false);
});

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - getXOffset(e.target);
        initialY = e.touches[0].clientY - getYOffset(e.target);
    } else {
        initialX = e.clientX - getXOffset(e.target);
        initialY = e.clientY - getYOffset(e.target);
    }

    if (e.target.classList.contains("item")) {
        active = true;
        dragItem = e.target; // 드래그할 아이템을 저장
    }
}

function dragEnd(e) {
    if (!dragItem) return; // dragItem이 null인 경우 처리

    initialX = currentX;
    initialY = currentY;
    active = false;

    // 충돌 감지 및 이벤트 처리
    checkCollision(dragItem); // dragItem을 전달
    dragItem = null; // 드래그가 끝나면 dragItem 초기화
}

function drag(e) {
    if (active) {
        e.preventDefault();

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        setTranslate(currentX, currentY, dragItem);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    el.dataset.xOffset = xPos;
    el.dataset.yOffset = yPos;
}

function getXOffset(el) {
    return parseFloat(el.dataset.xOffset) || 0;
}

function getYOffset(el) {
    return parseFloat(el.dataset.yOffset) || 0;
}

// 충돌 감지 함수
function checkCollision(item) {
    if (!item) return; // item이 null인 경우를 처리

    var itemRect = item.getBoundingClientRect();
    var earthwormRect = earthworm.getBoundingClientRect();

    //이동되는 이미지의 중앙 좌표
    var itemX = itemRect.left + itemRect.width/2;
    var itemY = itemRect.top + itemRect.height/2;

    //지렁이의 중심 좌표
    var earthwormCenterX = earthwormRect.left + earthworm.width/2;
    var earthwormCenterY = earthwormRect.top + earthworm.height/2;

    //지렁이 음식 먹는 범위 + 마우스 위치 출력
    // console.log("earthwormEatLeft : ", earthwormRect.left);
    // console.log("earthwormEatRight : ", earthwormCenterX);
    // console.log("earthwormEatTop : ", earthwormRect.top);
    // console.log("earthwormEatBottom : ", earthwormCenterY);

    //이동한 아이템의 위치
    console.log("itemX : " + itemX);
    console.log("itemY : " + itemY);

    // 아이템의 경계와 중앙 지렁이의 중앙 좌표 비교
    if (
        earthwormRect.left <= itemX &&
        itemX <= earthwormCenterX   &&
        earthwormRect.top <= itemY  &&
        itemY <= earthwormCenterY
    ) {
        shrinkItem(item); // item을 전달
        changeEarthwormEating();
    }
}

// 아이템 크기 감소 함수
function shrinkItem(item) {
    var originalWidth = item.offsetWidth;
    var originalHeight = item.offsetHeight;
    var currentCount = 0; // 실행 횟수 카운터

    function shrink(originalWidth, originalHeight) {
        if (currentCount < 5) { // 지정된 횟수보다 적으면 계속 실행
            if (originalWidth > 0) {
                var ChangedWidth = originalWidth * 0.75; // 25% 감소
                var ChangedHeight = originalHeight * 0.75;

                item.style.width = ChangedWidth + 'px';
                item.style.height = ChangedHeight + 'px';

                console.log("originalWidth : "+ originalWidth);
                console.log("originalheight : "+ originalHeight);
                console.log("changedWidth : "+ ChangedWidth);
                console.log("ChangedHeight : "+ ChangedHeight);


                // 이미지 위치 조정
                // item.style.transform = `translate(${originalWidth - ChangedWidth/2}px, ${originalHeight - ChangedHeight/2}px)`;


            
                // item.style.right = (originalWidth - ChangedWidth/2)  + "px";
                // item.style.top = (originalHeight - ChangedHeight/2)  + "px";

                currentCount++; // 카운터 증가
                setTimeout(shrink, 500); // 0.5초 후에 다시 호출
            }else{
                item.remove();
            }
        } else {
            item.remove(); // 아이템 제거
        }
    }

    shrink(originalWidth, originalHeight); // 첫 번째 호출
}

// 중앙 이미지 변경 함수
function changeEarthwormEating() {
    earthworm.src = "./Img/earthworm/eatingearthworm2.gif"; // 새로운 이미지 경로

    setTimeout(() => {
        earthworm.src ="./Img/earthworm/earthworm1.png"
        foodcounter++;
        if(foodcounter === 6){
            earthworm.src = "./Img/earthworm/earthworm6.png";
            setTimeout(() => {
                earthworm.style.height = 600 + "px";  
                earthworm.style.top = 15 + "%";  
                earthworm.src = "./Img/earthworm/jumpworm.gif";
            }, 1000);
            setTimeout(() => {
                //꽃 이미지 지렁이 구멍으로 위치 변경해야 함
                flower()                
            }, 2500);

        }
    }, 3000);
}

function flower(){
    setTimeout(() => {
        earthworm.style.height = 650+ "px";
        earthworm.style.top = 12 + "%";  
        earthworm.src ="./Img/flower/flower.gif";
    }, 3000);
}