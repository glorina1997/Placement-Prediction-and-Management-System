const warningIcon=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
const loadingIcon=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;
const errorIcon=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d50000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
function showPopUp(type,message)
{
  var overlay=document.createElement("div");
  overlay.classList.add("overlay");
  var pop=document.createElement("div");
  pop.classList.add("pop-up");
  pop.classList.add(`pop-${type}`);
  var close=document.createElement("div");
  close.classList.add("close");
  close.innerHTML="&times;";
  close.addEventListener("click",closeOverlay);
  pop.appendChild(close);
  var icon=document.createElement("div");
  icon.classList.add("icon");
  icon.innerHTML=type=="error"?errorIcon:warningIcon;
  pop.appendChild(icon);
  var wrapper=document.createElement("div");
  wrapper.classList.add("pop-wrapper");
  var title=document.createElement("div");
  title.classList.add("title");
  title.innerHTML=type;
  wrapper.appendChild(title);
  var subtitle=document.createElement("div");
  subtitle.classList.add("subtitle");
  subtitle.innerHTML=message;
  wrapper.appendChild(subtitle);
  pop.appendChild(wrapper);
  overlay.appendChild(pop);
  document.body.appendChild(overlay);
}
function closeOverlay(event)
{
  var c=event.currentTarget.parentNode.parentNode;
  c.parentNode.removeChild(c);
}
function popUpImageUploadPreview(callback)
{
  var overlay=document.createElement("div");
  overlay.classList.add("overlay");
  var pop=document.createElement("div");
  pop.classList.add("pop-up-image-preview-container");
  var close=document.createElement("div");
  close.classList.add("close");
  close.innerHTML="&times;";
  close.addEventListener("click",closeOverlay);
  pop.appendChild(close);
  var preview=document.createElement("img");
  preview.classList.add("pop-up-upload-preview");
  preview.id="pop-up-upload-preview";
  pop.appendChild(preview);
  var previewLoader=document.createElement("div");
  previewLoader.classList.add("pop-up-upload-loader");
  pop.appendChild(previewLoader);
  var wrapper=document.createElement("div");
  wrapper.classList.add("pop-up-wrapper");
  var label=document.createElement("label");
  label.innerHTML="Enter Image Title";
  pop.appendChild(label);
  var input=document.createElement("input");
  input.type="text";
  input.name="title";
  input.id="upload-title";
  input.placeholder="Image Title";
  wrapper.appendChild(input);
  var button=document.createElement("button");
  button.classList.add("up-button");
  button.type="button";
  button.innerHTML="Upload";
  button.addEventListener("click",callback);
  wrapper.appendChild(button);
  pop.appendChild(wrapper);
  overlay.appendChild(pop);
  document.body.appendChild(overlay);
}
