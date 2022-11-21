class HTMLFactory {
	constructor() {}
	init() {
		const generateButton = document.getElementById("generate");
		generateButton.addEventListener("click", this.generatePhoto);
		this.makeGrid();
	}
	async generatePhoto() {
		const photoInput = document.querySelector("#photo-input");
		const loading = document.getElementById("loading");
		const text = photoInput.value;
		photoInput.value = "";
		loading.classList.remove("hidden");
		const response = await fetch("/openai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ prompt: text }),
		});
		const data = await response.json();
		if (data.error != null) {
			this.message(`Error: ${data.error}`, false);
			return;
		} else {
			await this.makeGrid();
		}
		await loading.classList.add("hidden");
	}

	async fetchPhotos() {
		const res = await fetch("/photos", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const photos = await res.json();
		return photos;
	}

	async makeGrid() {
		const photos = await this.fetchPhotos();
		if (photos.error != null) {
			this.message(`Error: ${photos.error}`, false);
			return;
		}
		let fileDates = photos.files.map((file) =>
			Number(file.split("-")[1].replace(".jpg", ""))
		);
		fileDates = fileDates.sort((a, b) => b - a);
		const files = [];
		for (let i = 0; i < fileDates.length; i++) {
			for (let j = 0; j < fileDates.length; j++) {
				if (photos.files[j].includes(fileDates[i])) {
					files.push(photos.files[j]);
					break;
				}
			}
		}
		const grid = document.getElementById("results-grid");
		const pGrid = document.getElementById("placeholder-grid");
		pGrid.remove();
		grid.innerHTML = "";
		files.forEach((photo) => {
			const img = document.createElement("img");
			img.src = "./assets/" + photo;
			img.classList.add(
				"border-b-8",
				"border-emerald-700",
				"hover:border-emerald-500",
				"rounded",
				"ring-1"
			);
			grid.appendChild(img);
		});
	}

	message(message, success) {
		const messageContainer = document.getElementById("message-container");
		const errorDiv = document.createElement("div");
		const innerDiv = document.createElement("div");
		const textDiv = document.createElement("div");
		innerDiv.classList.add(
			"flex",
			"justify-center",
			"items-center",
			"text-center",
			"py-2",
			"text-xl"
		);
		textDiv.classList.add("text-white");
		textDiv.innerText = `${message}`;
		innerDiv.appendChild(textDiv);
		errorDiv.classList.add("bg-red-400", "rounded", "mx-4");
		messageContainer.appendChild(errorDiv);
		errorDiv.appendChild(innerDiv);
		errorDiv.classList.add("animate-fade");
		//wait 5 seconds and remove error
		setTimeout(() => {
			messageContainer.removeChild(errorDiv);
		}, 5000);
	}
}
