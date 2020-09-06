export function createToast(text, typeOfToast) {
    const toast = document.createElement("div");
    toast.id = "toast";
    toast.classList.add("show");
    let color = typeOfToast === "error" ? "#ff0000" : "#47e68c";
    toast.style.backgroundColor = color;
    toast.innerHTML = text;
    setTimeout(function() {
        toast.classList.remove("show");
    }, 3000);
    return toast;
}