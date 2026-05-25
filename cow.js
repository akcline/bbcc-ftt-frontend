const API_URL = 'https://bbcc-ftt-api-production.up.railway.app';

async function loadCow() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const content = document.getElementById('content');

    if (!id) {
    content.innerHTML = '<p class="error">No cow ID provided.</p>';
    return;
    }

    try {
    const res = await fetch(`${API_URL}/cows/${id}`);
    if (!res.ok) throw new Error('Not found');
    const cow = await res.json();

    document.title = `${cow.name} - Pasture to Plate`;

    localPhotoPath = `images/cows/${id}.jpg`;
    localPedigreePath = `images/pedigrees/${id}.jpg`;

    const score = cow.meat_grade;
    const percentage = ((score - 1) / 4) * 100;

    content.innerHTML = `
        <h2 id="pasture-to-plate">Pasture to Plate</h2>
        <div class="info-header">
        <img class="cow-photo" src="${localPhotoPath}" alt="${cow.name}" />
        <h2 class="cow-name">${cow.name}</h2>
        <p id="cow-id">ID #${cow.cow_id}</p>
        </div>
        <div class="info-blob">
        <label class="info-blob-headers">Date of Birth</label>
        <p class="info-blob-p">${new Date(cow.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <label class="info-blob-headers">Japanese Prefectural Percentage</label>
        <div class="info-blob-p">
            ${Object.entries(cow.prefectural_data).map(([name, percentage]) =>
            `<p>${name}: ${percentage}%</p>`
        ).join('')}
        </div>

        <label class="info-blob-headers">Food Program</label>
        <p class="info-blob-p">
            We follow a feeding program utilized by Shogo Takeda. He was responsible for bringing the majority of Wagyu animals and 
            their genetics to the USA from Japan.
            <br>
            It is a mix of orchard grass hay, corn, oats, 12% protein pellets, barley, and molasses.
        </p>

        <label class="info-blob-headers">Pedigree</label>
        <br>
        <img class="pedigree-img" src="${localPedigreePath}" alt="Pedigree chart for ${cow.name}" />

        <label class="info-blob-headers">MIJ (Meat Image Japan) Score</label>
        <div class="info-blob-p">
            <div class="wagyu-slider">
                <div class="wagyu-track">
                <div class="wagyu-fill" id="wagyuFill"></div>
                <div class="wagyu-thumb" id="wagyuThumb"></div>
                </div>
                <div class="wagyu-labels">
                <span>A1</span>
                <span>A2</span>
                <span>A3</span>
                <span>A4</span>
                <span>A5</span>
                </div>
                <p class="wagyu-grade" id="wagyuGrade"></p>
            </div>
        </div>

        </div>
    `;

    document.getElementById('wagyuFill').style.width = `${percentage}%`;
    document.getElementById('wagyuThumb').style.left = `${percentage}%`;
    document.getElementById('wagyuGrade').textContent = `A${score}`;
    
    } catch (err) {
    content.innerHTML = '<p class="error">Cow profile not found.</p>';
    }
}

loadCow();