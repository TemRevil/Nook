// Loading Theme
document.addEventListener("DOMContentLoaded", function () {
    var loadingElement = document.querySelector('.n-loading');
    var body = document.querySelector('body');

    function hideLoading() {
        loadingElement.style.display = 'none';
    }

    if (body.getAttribute('data-loaded') === 'true') {
        hideLoading();
    } else {
        window.addEventListener('load', function () {
            hideLoading();
            body.setAttribute('data-loaded', 'true');
        });
    }
});
// ----------------------------------------------------------------------------
// Main Event
var inboxCounter = 1;
var emailCounter = 0;
var countdownTimers = {};
const maxEmails = 10;
const initialTimerValue = 300;

function addRandomEmail() {
    if (emailCounter >= maxEmails) {
        displayAlert("You cannot add more than 10 emails.");
        return;
    }

    var randomEmail = generateRandomEmail();
    var newEmail = document.createElement("li");
    var emailId = "email-" + inboxCounter;
    var inboxId = "e-inbox-" + inboxCounter;  // تعيين قيمة inboxId
    newEmail.id = "emailList-" + emailId;
    newEmail.className = "e-nook-mail";
    newEmail.setAttribute("data-email-name", randomEmail);
    newEmail.setAttribute("data-inbox-id", inboxId);
    var emailText = document.createElement("p");
    emailText.textContent = randomEmail;
    var removeButton = document.createElement("button");
    removeButton.className = "remove-mail";
    removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    removeButton.setAttribute("onclick", `removeEmail('${emailId}')`);
    newEmail.appendChild(emailText);
    newEmail.appendChild(removeButton);
    document.getElementById("emailList").appendChild(newEmail);

    addInbox(randomEmail, emailId);

    emailCounter++;

    document.getElementById(inboxId).addEventListener("click", function () {
        displayEmail(emailId, inboxId);
    });

    emailText.addEventListener("click", function () {
        displayEmail(emailId, inboxId);
    });
}

function addInbox(emailName, emailId) {
    var newInbox = document.createElement("div");
    newInbox.className = "e-flex";
    var inboxId = "e-inbox-" + inboxCounter;
    newInbox.id = inboxId;

    var inboxNav = document.createElement("nav");
    inboxNav.className = "e-inbox-nav";
    var navEmail = document.createElement("p");
    navEmail.className = "e-nav-email";
    navEmail.innerHTML = `<i class="fa-solid fa-inbox"></i> ${emailName}`;
    var refreshButton = document.createElement("button");
    refreshButton.type = "button";
    refreshButton.className = "e-inbox-refresh";
    refreshButton.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Refresh';
    refreshButton.addEventListener("click", function () {
        refreshInbox();
    });
    var mailTimeContainer = document.createElement("div");
    var mailTimeButton = document.createElement("button");
    mailTimeButton.className = "mail-time";
    mailTimeButton.id = `e-inbox-re-${inboxCounter}`;
    mailTimeButton.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
    mailTimeButton.addEventListener("click", function () {
        resetTimer(inboxId);
    });
    var mailTimeLimit = document.createElement("span");
    mailTimeLimit.className = "mail-time-limit";
    mailTimeLimit.id = `e-inbox-t-${inboxCounter}`;
    mailTimeLimit.textContent = formatTime(initialTimerValue);
    mailTimeContainer.appendChild(mailTimeButton);
    mailTimeContainer.appendChild(mailTimeLimit);

    inboxNav.appendChild(navEmail);
    inboxNav.appendChild(refreshButton);
    inboxNav.appendChild(mailTimeContainer);

    var inboxMails = document.createElement("div");
    inboxMails.className = "e-inbox-mails";
    var ul = document.createElement("ul");
    ul.id = `inboxList-${inboxCounter}`;
    inboxMails.appendChild(ul);

    newInbox.appendChild(inboxNav);
    newInbox.appendChild(inboxMails);

    document.querySelector(".e-inbox").appendChild(newInbox);

    var allInboxes = document.querySelectorAll('.e-flex');
    allInboxes.forEach(function (inbox, index) {
        if (index !== 0) {
            inbox.classList.add('e-display');
        }
    });

    setCountdownTimer(initialTimerValue, inboxId, emailId);

    inboxCounter++;
}

function setCountdownTimer(timeInSeconds, inboxId, emailId) {
    countdownTimers[inboxId] = setInterval(function () {
        timeInSeconds--;
        if (timeInSeconds < 0) {
            clearInterval(countdownTimers[inboxId]);
            removeInbox(inboxId);
            
            if (emailId) {
                removeEmailOnTimerExpiry(emailId);
            }
        }
        var mailTimeLimit = document.getElementById(`e-inbox-t-${inboxId.slice(-1)}`);
        if (mailTimeLimit) {
            mailTimeLimit.textContent = formatTime(timeInSeconds);
        }
    }, 1000);
}

function resetTimer(inboxId) {
    clearInterval(countdownTimers[inboxId]);
    setCountdownTimer(initialTimerValue, inboxId);
}

function removeEmailFromAside(emailId) {
    var emailToRemove = document.getElementById(`emailList-${emailId}`);
    if (emailToRemove) {
        emailToRemove.remove();
    }
}

function removeEmailByInboxId(inboxId) {
    var emailsToRemove = document.querySelectorAll(`.e-nook-mail[data-inbox-id="${inboxId}"]`);
    if (emailsToRemove) {
        emailsToRemove.forEach(function (email) {
            removeEmail(email.id);
        });
    }
}

function removeEmailOnTimerExpiry(emailId) {
    if (emailId) {
        var inboxId = "e-inbox-" + emailId.split("-")[1];

        removeEmailFromAside(emailId);

        removeInbox(inboxId);
    }
}

function removeInbox(inboxId) {
    var inboxToRemove = document.getElementById(inboxId);
    if (inboxToRemove) {
        clearInterval(countdownTimers[inboxId]);

        var emailsListToRemove = document.getElementById(`inboxList-${inboxId.slice(-1)}`);
        if (emailsListToRemove) {
            emailsListToRemove.remove();
        }

        removeEmailByInboxId(inboxId);

        removeEmailFromAside(inboxId);

        inboxToRemove.remove();
        inboxCounter--;
        return true;
    }
    return false;
}

function removeEmail(emailId) {
    var emailElement = document.getElementById(`emailList-${emailId}`);
    if (emailElement) {
        var inboxId = emailElement.getAttribute("data-inbox-id");
        if (inboxId) {
            removeInbox(inboxId);
        }
        emailElement.remove();
    }
}

function refreshInbox() {
    console.log("Inbox Refreshed");
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function displayEmail(emailId, inboxId) {
    var allInboxes = document.querySelectorAll('.e-flex');
    allInboxes.forEach(function (inbox) {
        if (inbox.id !== inboxId) {
            inbox.classList.add('e-display');
        } else {
            inbox.classList.remove('e-display');
            var clickedEmail = document.getElementById(emailId);
            if (clickedEmail) {
                var emailName = clickedEmail.getAttribute("data-email-name");
                document.querySelector(".e-nav-email").innerHTML = `<i class="fa-solid fa-inbox"></i> ${emailName}`;
            }
        }
    });

    var clickedEmail = document.getElementById(emailId);
    if (clickedEmail) {
        clickedEmail.scrollIntoView({ behavior: "instant" });
    }
}

function displayAlert(message) {
    var alertsElement = document.querySelector(".e-alerts");
    if (alertsElement) {
        alertsElement.textContent = message;
        setTimeout(function () {
            hideAlert();
        }, 3000);
    }
}

function hideAlert() {
    var alertsElement = document.querySelector(".e-alerts");
    if (alertsElement) {
        alertsElement.textContent = "";
    }
}

function generateRandomEmail() {
    const emailCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const randomPartLength = 10;
    const randomPart = generateRandomString(emailCharacters, randomPartLength);
    const randomEmail = `${randomPart}@enookil.com`;
    return randomEmail;
}

function generateRandomString(characters, length) {
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}

setInterval(function () {
    checkAndRemoveOrphan();
}, 1);

function checkAndRemoveOrphan() {
    for (let i = 1; i <= maxEmails; i++) {
        const emailId = `emailList-email-${i}`;
        const inboxId = `e-inbox-${i}`;

        const emailElement = document.getElementById(emailId);
        const inboxElement = document.getElementById(inboxId);

        if (!emailElement && inboxElement) {
            if (removeInbox(inboxId)) {
                console.log(`Inbox ${inboxId} removed successfully.`);
            } else {
                console.log(`Failed to remove Inbox ${inboxId}.`);
            }
        } else if (emailElement && !inboxElement) {
            removeEmail(emailId);
        }
    }
}
// ----------------------------------------------------------------------------
// View Message Event
function displayEmailDetails(emailClass) {
    var emailElement = document.querySelector('.' + emailClass);

    if (emailElement) {
        var inboxOpenElement = document.getElementById('e-inbox-open');
        var inboxViewElement = document.querySelector('.e-inbox-view');

        // العنوان يظهر في <h1> داخل e-inbox-open
        inboxOpenElement.innerHTML = `<h1>${emailElement.querySelector('.e-mail-title').innerHTML}</h1>${emailElement.querySelector('.e-mail-text').innerHTML}`;

        inboxViewElement.style.display = 'flex';
        document.addEventListener('keydown', handleEscKeyPress);
    }
}

function handleEmailClick(emailClass) {
    displayEmailDetails(emailClass);
}

function handleCloseButtonClick() {
    var inboxViewElement = document.getElementById('e-inbox-view');
    var inboxOpenElement = document.getElementById('e-inbox-open');

    inboxOpenElement.innerHTML = '';
    inboxViewElement.style.display = 'none';
    document.removeEventListener('keydown', handleEscKeyPress);
}

function handleEscKeyPress(event) {
    if (event.key === 'Escape') {
        handleCloseButtonClick();
    }
}
// ----------------------------------------------------------------------------
