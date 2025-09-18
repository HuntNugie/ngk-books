const API =
  'https://bukuacak-9bdcb4ef2605.herokuapp.com/api/v1/book';
const proxyUrl = 'https://corsproxy.io/';
const konten = document.getElementById ('konten');

// const defaults = function (link) {
//   let hasil = [];
//   fetch (link).then (response => {
//     if(response.ok){
//         return response.json ()
//     }
//   }).then (response => {
//     const {books} = response;
//     books.map (el => {
//       fetch (proxyUrl + el.cover_image).then (res => {
//         if(res.ok){
//             return res.blob ()
//         }
//       }).then (res => {
//         if(res){
//              let imageUrl = URL.createObjectURL (res);
//         let teks = ` <div class="col-4 mt-3">
//                         <div class="card" style="width: 25rem">
//                             <img src="${imageUrl}" class="card-img-top img-fluid" alt="..." />
//                             <div class="card-body">
//                                 <h5 class="card-title">${el.title}</h5>
//                                 <p class="card-text">
//                                     ${el.summary.slice(0,101)+"...."}
//                                 </p>
//                                 <button class="btn btn-primary">Detail buku</button>
//                             </div>
//                  </div>
//          </div>`;
//         hasil.push (teks);
//         }
//       })
//       .finally(()=>{
//         konten.innerHTML = hasil.join("")
//       })
//     });
//   });
// };
// defaults(API)

// function untuk default saat browser di buka
const defaults = async function (link) {
  const get = await getData (link);
  try {
    let result = await Promise.all (get);
    konten.innerHTML = renderUI (result);
  } catch (err) {
    console.log (`error : ${err}`);
  }
};

// function untuk fetch data seluruh api nya
function getData (link) {
  return fetch (link).then (res => res.json ())
    .then (({books}) => books)
    .then(response=>getImage(response));
}


// function untuk render ui nya
function renderUI (data) {
  return data
    .map (element => {
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
      const imageUrl = await fetch (proxyUrl + el.cover_image);
      const imageBlob = await imageUrl.blob ();
      const imgUrl = URL.createObjectURL (imageBlob);
      if(imageUrl.ok){
        return {el, imgBlob: imgUrl};
      }else{
        return {el,imgBlob:"fallback.jpg"}
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
  konten.innerHTML = renderUI(result)
  history.pushState({page:"search",keyword:cari.value,data:result},"",`?search=${cari.value}`)
})

// jika awal buka web
if(history.state === null){
  defaults (API);
}
// jika kembali ke state
window.addEventListener("popstate", function(event){
  if(event.state === null){
    defaults(API)
  }else{
    const result = renderUI(event.state.data)
    konten.innerHTML = result
  }
})