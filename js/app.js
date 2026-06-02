// ===============================
// COUNTER ANIMATION
// ===============================

const counters = document.querySelectorAll(".counter");

const startCounters = () => {

    counters.forEach(counter => {

        const target = +counter.getAttribute("data-target");

        const updateCounter = () => {

            const current = +counter.innerText;

            const increment = target / 100;

            if(current < target){

                counter.innerText =
                Math.ceil(current + increment);

                setTimeout(updateCounter, 20);

            }else{

                counter.innerText = target;
            }
        };

        updateCounter();
    });
};



// ===============================
// INTERSECTION OBSERVER
// ===============================

const statsSection =
document.querySelector(".stats");

let counterStarted = false;

if(statsSection){

    const observer =
    new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if(entry.isIntersecting &&
               !counterStarted){

                startCounters();
                counterStarted = true;
            }
        });

    }, {
        threshold:0.3
    });

    observer.observe(statsSection);
}



// ===============================
// SCROLL REVEAL ANIMATION
// ===============================

const revealElements =
document.querySelectorAll(
".feature-card, .stat-box, .testimonial-card, .cta-box"
);

const revealOnScroll = () => {

    revealElements.forEach(element => {

        const windowHeight =
        window.innerHeight;

        const revealTop =
        element.getBoundingClientRect().top;

        const revealPoint = 100;

        if(revealTop < windowHeight - revealPoint){

            element.classList.add("active");
        }
    });
};

window.addEventListener(
"scroll",
revealOnScroll
);

revealOnScroll();



// ===============================
// NAVBAR BACKGROUND EFFECT
// ===============================

const navbar =
document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        navbar.style.background =
        "rgba(15,23,42,0.85)";

        navbar.style.backdropFilter =
        "blur(20px)";

    }
    else{

        navbar.style.background =
        "rgba(255,255,255,0.08)";
    }
});



// ===============================
// HERO IMAGE FLOAT EFFECT
// ===============================

const heroCard =
document.querySelector(".glass-card");

document.addEventListener(
"mousemove",
(e) => {

    if(!heroCard) return;

    const x =
    (window.innerWidth / 2 - e.pageX) / 40;

    const y =
    (window.innerHeight / 2 - e.pageY) / 40;

    heroCard.style.transform =
    `rotateY(${x}deg) rotateX(${-y}deg)`;
});



// ===============================
// SMOOTH BUTTON SCALE
// ===============================

const buttons =
document.querySelectorAll(
".btn-primary, .btn-secondary"
);

buttons.forEach(button => {

    button.addEventListener(
    "mouseenter",
    () => {

        button.style.transform =
        "scale(1.05)";
    });

    button.addEventListener(
    "mouseleave",
    () => {

        button.style.transform =
        "scale(1)";
    });
});



// ===============================
// PARALLAX BLOBS
// ===============================

const blob1 =
document.querySelector(".blob1");

const blob2 =
document.querySelector(".blob2");

window.addEventListener(
"mousemove",
(e) => {

    const x = e.clientX / 50;
    const y = e.clientY / 50;

    if(blob1){

        blob1.style.transform =
        `translate(${x}px, ${y}px)`;
    }

    if(blob2){

        blob2.style.transform =
        `translate(${-x}px, ${-y}px)`;
    }
});



// ===============================
// ACTIVE NAV LINK
// ===============================

const navLinks =
document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {

    link.addEventListener(
    "click",
    () => {

        navLinks.forEach(l =>
            l.classList.remove("active-link")
        );

        link.classList.add("active-link");
    });
});



// ===============================
// PAGE LOADER EFFECT
// ===============================

window.addEventListener(
"load",
() => {

    document.body.style.opacity = "0";

    setTimeout(() => {

        document.body.style.transition =
        "opacity 1s ease";

        document.body.style.opacity = "1";

    }, 100);
});