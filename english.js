// Play audio
const PlaySound = (soundobj) => {
    var thissound = document.getElementById(soundobj);
    thissound.play();
};

// Stop audio
const StopSound = (soundobj) => {
    var thissound = document.getElementById(soundobj);
    thissound.pause();
    thissound.currentTime = 0;
};


const url = "assets/docs/eng/eng.pdf";

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 0.6,
    canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d');


//render page
const renderPage = num => {
    pageIsRendering = true;

    //get page
    pdfDoc.getPage(num).then(page => {
        //set scale
        const viewport = page.getViewport({
            scale
        });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        }

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;
            if (pageNumIsPending != null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        //output current page
        document.querySelector('#page-num').textContent = num;

    });
};
//check for render
const queueRenderPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;

    } else {
        renderPage(num);
    }
}


//showprev page 
const showPrevPage = () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;

    setAudioAttribute();
    queueRenderPage(pageNum);
}
//shownext page 
const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;

    setAudioAttribute();
    queueRenderPage(pageNum);
}
const setAudioAttribute = () => {
    const onhover = document.querySelector('.onhover');

    onhover.setAttribute('onmouseover', `PlaySound('eng-${pageNum}')`);
    onhover.setAttribute('onmouseout', `StopSound('eng-${pageNum}')`);
};
setAudioAttribute();


//get document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.querySelector('#page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
});




//button events
document.querySelector("#prev-page").addEventListener("click", showPrevPage);
document.querySelector("#next-page").addEventListener("click", showNextPage);