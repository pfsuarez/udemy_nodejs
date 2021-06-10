const deleteProduct = (btn) => {
  console.log(btn.parentNode);
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");

  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then(result => result.json())
    .then(data => {
      // productElement.parentNode.removeChild(productElement);
      productElement.remove();
    })
    .catch((err) => console.log(err));
};
