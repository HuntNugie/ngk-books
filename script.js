const API =
  'https://bukuacak-9bdcb4ef2605.herokuapp.com/api/v1/book';
const proxyUrl = 'https://corsproxy.io/';
const konten = document.getElementById ('konten');


// function untuk default saat browser di buka
const defaults = async function (link) {
  try {
    const get = await getData (link);
    let result = await Promise.all (get);
    renderUI(result)
    // konten.innerHTML = renderUI (result);
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
        <button class="btn btn-primary w-100" data-bukuID="${element.el._id}">Detail buku</button>
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
if(history.state === null){
  defaults (API);
}else{
  const result = renderUI(history.state.data)

}
// jika kembali ke state
window.addEventListener("popstate", function(event){
  if(event.state === null){
    defaults(API)
  }else{
    const result = renderUI(event.state.data)
  
  }
})

