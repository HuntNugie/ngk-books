const API =
  'https://bukuacak-9bdcb4ef2605.herokuapp.com/api/v1/book';
const proxyUrl = 'https://corsproxy.io/';
const konten = document.getElementById ('konten');
const detail = document.querySelector("#detail")
const home = document.querySelector("#home")

// function untuk default saat browser di buka
const defaults = async function (link) {
  try {
    const get = await getData (link);
    history.pushState({page:"home",data:get},"","")
    renderUI(get)
  } catch (err) {
    console.log (`error : ${err}`);
  }
};

// function untuk fetch data seluruh api nya
function getData (link) {
  return fetch (link).then (res => res.json ())
    .then (({books}) => books)
}


// function untuk render ui nya
async function renderUI (data) {
  const gambar = getImage(data)
  // console.log(gambar)
  const result = await Promise.all(gambar)
  // console.log(result)
  konten.innerHTML = result.map ((element) => {
      return `<div class="col-12 col-sm-6 col-md-4 mt-3">
  <div class="card h-100">
    <img src="${element.imgBlob}" class="card-img-top img-fluid" style="object-fit: cover; max-height: 400px;" alt=""fallback.jpg"" />
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${element.el.title}</h5>
      <p class="card-text">
        ${element.el.summary.slice (0, 101) + '....'}
      </p>
      <div class="mt-auto">
        <button class="btn btn-primary w-100 detail-button" data-bukuID="${element.el._id}">Detail buku</button>
      </div>
    </div>
  </div>
</div>
`;
    })
    .join ('');
}

// function untuk dapat image
function getImage(get){
 return get.map (async el => {
      try {
        const imageUrl = await fetch (proxyUrl + el.cover_image);
        const imageBlob = await imageUrl.blob ();
        const imgUrl = URL.createObjectURL (imageBlob);
        if(imageUrl.ok){
          return {el,imgBlob:imgUrl};
        }else{
          return {el,imgBlob:"fallback.jpg"}
        }
      } catch (error) {
        console.log("error : "+error) 
      }
    });
}


// untuk searching
const search = async function(link,cari){
  try{
    const data = await getData(`${link}?keyword=${cari}`)
    const result = await Promise.all(data)
    return result
  }catch(err){
    console.log("error : "+err)
  }
}

const cari = document.querySelector("input")
document.querySelector(".cariButton").addEventListener("click",async function(){
  let result = await search(API,cari.value)
  renderUI(result)
  history.pushState({page:"search",keyword:cari.value,data:result},"",`?search=${cari.value}`)
})

// jika awal buka web
window.onload = function(){
  if(history.state === null){
  defaults (API);
  console.log("Ini pertama kali di buka")
}else if(history.state?.page === "detail"){
  renderDetail(this.history.state.data)
}
else{
  const result = renderUI(history.state.data)
}
}
// jika kembali ke state
window.addEventListener("popstate", function(event){
  if(event.state === null){
    defaults(API)
  }else if(event.state?.page === "detail"){
    renderDetail(event.state.data)
  }
  else{
    const result = renderUI(event.state.data)
  home.classList.toggle("d-none")
  detail.classList.toggle("d-none")  
  }
})

async function getDetail(link){
  const data = await fetch(link)
  const response = await data.json()
    history.pushState({page:"detail",data:response},"",`?detail=${response.title}`)
  return  renderDetail(response) 
}
function renderDetail(response){
  home.classList.toggle("d-none")
  detail.classList.toggle("d-none")
 
    detail.innerHTML = `   <!-- Header -->
    <div class="row">
      <div class="col-12 border-bottom pb-3">
        <h1 class="text-center my-4">Detail Buku</h1>
      </div>
    </div>

    <!-- Detail Buku -->
    <div class="row my-4">
      <div class="col-md-4 text-center">
        <img src="${response.cover_image}" 
             alt="cover buku" 
             class="img-fluid rounded shadow" />
      </div>
      <div class="col-md-8">
        <h2 class="mb-3">${response.title}</h2>
        <p><strong>Penulis:</strong> ${response.author.name}</p>
        <p><strong>Tahun Terbit:</strong> ${response.details.published_date}</p>
        <p><strong>Kategori:</strong> ${response.category.name}</p>
        <p class="mt-3">
        ${response.summary}
        </p>

        <!-- Tombol kembali -->
        <a href="index.html" class="btn btn-secondary mt-4">← Kembali</a>
      </div>
    </div>`
}
konten.addEventListener("click",(el)=>{
  if(el.target.classList.contains("detail-button")){
    const id = el.target.dataset.bukuid
    const klik = getDetail(`https://bukuacak-9bdcb4ef2605.herokuapp.com/api/v1/book?_id=${id}`)
  }
})

