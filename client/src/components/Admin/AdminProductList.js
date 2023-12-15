import { Link, useNavigate } from "react-router-dom";

import { StarIcon } from "@heroicons/react/20/solid";
import { discountedPrice } from "../../app/constants";

export default function AdminProductList({ products }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 className="sr-only">Products</h2>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative bg-gray-100 p-2 shadow-md"
          >
            <Link to={`/product-details/${product.id}`}>
              <div className="min-h-60 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-300   lg:h-60">
                <img
                  src={product.imageSrc}
                  alt={product.title}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">{product.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <StarIcon className="w-6 h-6 inline"></StarIcon>
                    <span className="align-bottom">{product.rating}</span>
                  </p>
                </div>
                <div>
                  <p className="text-lg line-through font-medium text-gray-900">
                    &#8377;{product.price}
                  </p>
                  <p className="text-lg   font-medium text-gray-400">
                    &#8377;{discountedPrice(product)}
                  </p>
                </div>
              </div>
              {product.stock === 0 && (
                <div>
                  <p className="text-sm text-red-400">Out Of stock</p>
                </div>
              )}
              {product.deleted && (
                <div>
                  <p className="text-sm text-red-400">product deleted</p>
                </div>
              )}
              <div className="mt-2">
                <Link
                  to={`/admin/product-form/edit/${product.id}`}
                  className="rounded-md my-4 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Edit Product
                </Link>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
