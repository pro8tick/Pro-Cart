import React, { useEffect, useState } from "react";
import "./Profile.scss";
import PageMenu from "../../components/pagemenu/PageMenu";
import loginImg from "../../assets/profile.png";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Card from "../../components/card/Card";
import {
  getUser,
  updatePhoto,
  updateUser,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { toast } from "react-toastify";
import { firstName } from "../../utils";

const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
const base_URL = "https://api.cloudinary.com/v1_1/dddmasqhk/image/upload";

const Profile = () => {
  const { isLoading, user } = useSelector((state) => state.auth);
  const [selectedEditIndex, setSelectedEditIndex] = useState(-1);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  const initialState = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    address: user?.address || {
      address: "",
      state: "",
      country: "",
      city: "",
      pin: "",
    },
  };
  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const saveProfile = async (e) => {
    e.preventDefault();
    const userData = {
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
    };
    await dispatch(updateUser(userData));
  };

  const savePhoto = async (e) => {
    e.preventDefault();
    let imageURL;

    try {
      if (
        profileImage !== null &&
        (profileImage.type === "image/jpeg" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", cloud_name);
        image.append("upload_preset", uploadPreset);

        //save image to cloudinary
        const res = await fetch(base_URL, {
          method: "POST",
          body: image,
        });

        const imageData = await res.json();
        //console.log(imageData);
        imageURL = imageData.url.toString();
      }

      const userData = {
        photo: imageURL || profile.photo,
      };
      await dispatch(updatePhoto(userData));
      setImagePreview(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Split the name into an array to access nested properties
    const nameArray = name.split(".");

    if (nameArray.length === 2) {
      // Handle the nested structure
      const updatedProfile = {
        ...profile,
        [nameArray[0]]: {
          ...profile[nameArray[0]],
          [nameArray[1]]: value,
        },
      };
      setProfile(updatedProfile);
    } else {
      // Handle top-level properties
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleRemove = (e, index) => {
    const newUser = { ...user, addresses: [...user.addresses] };
    newUser.addresses.splice(index, 1);
    dispatch(updateUser(newUser));
  };
  const handleEdit = (addressUpdate, index) => {
    const newUser = { ...user, addresses: [...user.addresses] };
    newUser.addresses.splice(index, 1, addressUpdate);
    dispatch(updateUser(newUser));
    setSelectedEditIndex(-1);
  };

  const handleEditForm = (index) => {
    setSelectedEditIndex(index);
    const address = user.addresses[index];
    setValue("name", address.name);
    setValue("phone", address.phone);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("address", address.address);
    setValue("pinCode", address.pinCode);
  };

  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: user?.role || "",
        address: user?.address || profile.address,
      });
    }
  }, [user]);

  return (
    <section className="--bg-grey">
      {isLoading && <Loader />}

      <div className="container">
        <PageMenu />
        <h2>Profile</h2>
        <div className="--flex-between --mb profile">
          <Card cardClass={"card"}>
            {!isLoading && user && (
              <>
                <div className="profile-photo">
                  <div className="--center-all">
                    <img src={imagePreview || user?.photo} alt="profile" />
                    <h3>Role: {profile.role}</h3>
                    {imagePreview !== null && (
                      <button
                        className="--btn --btn--secondary"
                        onClick={savePhoto}
                      >
                        <AiOutlineCloudUpload size={18} /> Upload Photo
                      </button>
                    )}
                  </div>
                </div>
                <form onSubmit={saveProfile}>
                  <p>
                    <label htmlFor="image">Change Photo:</label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </p>
                  <p>
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile?.name}
                      onChange={handleInputChange}
                      required
                    />
                  </p>
                  <p>
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile?.email}
                      onChange={handleInputChange}
                      disabled
                      required
                    />
                  </p>
                  <p>
                    <label htmlFor="phone">Phone:</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={profile?.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </p>
                  <button
                    type="submit"
                    className="--btn --btn-primary --btn-block"
                  >
                    Update Profile
                  </button>
                </form>
                <ul role="list">
                  <p className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    Your Addresses:
                  </p>
                  {user.addresses.map((address, index) => (
                    <div>
                      {index === selectedEditIndex ? (
                        <form
                          className="bg-white px-5 py-12"
                          noValidate
                          onSubmit={handleSubmit((data, e) => {
                            e.preventDefault();
                            handleEdit(data, index);
                            reset();
                          })}
                        >
                          <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                  <label
                                    htmlFor="name"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    Full name
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      type="text"
                                      {...register("name", {
                                        required: "name is required",
                                      })}
                                      id="name"
                                      className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>

                                <div className="sm:col-span-3">
                                  <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    Phone
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      type="tel"
                                      {...register("phone", {
                                        required: "phone is required",
                                      })}
                                      id="phone"
                                      className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>

                                <div className="col-span-full">
                                  <label
                                    htmlFor="address"
                                    className="block text-sm font-medium leading-6  text-gray-900"
                                  >
                                    Street address
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      type="text"
                                      {...register("address", {
                                        required: "address is required",
                                      })}
                                      id="address"
                                      className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>

                                <div className="sm:col-span-2 sm:col-start-1">
                                  <label
                                    htmlFor="city"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    City
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      type="text"
                                      {...register("city", {
                                        required: "city is required",
                                      })}
                                      id="city"
                                      className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>

                                <div className="sm:col-span-2">
                                  <label
                                    htmlFor="region"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    State
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      type="text"
                                      {...register("state", {
                                        required: "state is required",
                                      })}
                                      id="region"
                                      className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>

                                <div className="sm:col-span-2">
                                  <label
                                    htmlFor="postal-code"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    PIN
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      type="text"
                                      {...register("pinCode", {
                                        required: "pinCode is required",
                                      })}
                                      id="postal-code"
                                      className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 flex items-center justify-end gap-x-6">
                              <button
                                onClick={(e) => setSelectedEditIndex(-1)}
                                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                Edit Address
                              </button>
                            </div>
                          </div>
                        </form>
                      ) : null}
                      <li
                        key={index}
                        className="flex justify-between gap-x-6 py-5 px-3 border-solid border-2 border-gray-200"
                      >
                        <div className="flex min-w-0 gap-x-4">
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              {address.name}
                            </p>
                            <p className="mt-1 truncate text-sm leading-5 text-gray-700">
                              {address.address}
                            </p>
                            <p className="mt-1 truncate text-sm leading-5 text-gray-700">
                              {address.pinCode}
                            </p>
                          </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900">
                            Phone: {address.phone}
                          </p>
                          <p className="text-sm leading-6 text-gray-900">
                            {address.city}
                          </p>
                          <p className="text-sm leading-6 text-gray-900">
                            {address.state}
                          </p>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={(e) => handleEditForm(index)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={(e) => handleRemove(e, index)}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    </div>
                  ))}
                </ul>
              </>
            )}
          </Card>
          <div className="--card">
            <img src={loginImg} alt="login" width="400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export const UserName = () => {
  const { user } = useSelector((state) => state.auth);
  const username = user?.name || "...";

  return <span style={{ color: "#ff7722" }}>Hi, {firstName(username)} |</span>;
};

export default Profile;
