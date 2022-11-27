class HTMLFactory {
	constructor() {}
	init() {
		const generateButton = document.getElementById("generate");
		generateButton.addEventListener(
			"click",
			function () {
				this.generatePhoto();
			}.bind(this)
		);
		this.makeGrid();
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

	async deletePhoto(id) {
		const res = await fetch(`/photo/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const message = await res.json();
		return message;
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
		if (pGrid != null) {
			pGrid.remove();
		}
		grid.innerHTML = "";
		files.forEach((photo) => {
			const photoDiv = document.createElement("div");
			const img = document.createElement("img");
			const x = document.createElement("div");
			x.textContent = "X";
			x.classList.add(
				"text-xl",
				"text-red-500",
				"absolute",
				"top-0",
				"right-0",
				"m-2",
				"cursor-pointer",
				"z-10"
			);
			x.setAttribute("id", photo);
			x.addEventListener(
				"click",
				async function (e) {
					const id = e.target.id;
					console.log(id);
					const message = await this.deletePhoto(id);
					if (message.error != null) {
						this.message(`Error: ${message.error}`);
						return;
					}
					await this.makeGrid();
				}.bind(this)
			);

			img.src = "./assets/" + photo;
			photoDiv.classList.add(
				"border-b-8",
				"border-emerald-700",
				"hover:border-emerald-500",
				"rounded",
				"ring-1",
				"relative"
			);
			photoDiv.appendChild(img);
			photoDiv.appendChild(x);

			grid.appendChild(photoDiv);
		});
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
			loading.classList.add("hidden");
			return;
		}
		await this.makeGrid();
		await loading.classList.add("hidden");
	}

	message(message) {
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
