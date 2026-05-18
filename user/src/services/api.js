import axios from "axios"
import { getHeaders } from "../auth/authService"
// const BASE = "http://localhost:8000"
const BASE = import.meta.env.VITE_API_URL
export const login = (d) => axios.post(`${BASE}/login`, d)
export const signup = (d) => axios.post(`${BASE}/signup`, d)
export const changePassword = (d) => axios.post(`${BASE}/changePassword`, d)
export const getGames = () => axios.get(`${BASE}/games`)
export const getGameDetails = (id) => axios.get(`${BASE}/games/${id}`)
export const getSlots = (game_id) => axios.get(`${BASE}/slots/${game_id}`)
export const getSeats = (game_id) => axios.get(`${BASE}/seats/${game_id}`)
export const getFeedbacks = () => axios.get(`${BASE}/feedbacks`)
export const getProfile = () => axios.get(`${BASE}/user/profile`, { headers: getHeaders() })
export const updateProfile = (d) => axios.post(`${BASE}/user/updateProfile`, d, { headers: getHeaders() })
export const bookSeat = (d) => axios.post(`${BASE}/user/bookSeat`, d, { headers: getHeaders() })
export const myBookings = () => axios.get(`${BASE}/user/myBookings`, { headers: getHeaders() })
export const cancelBooking = (d) => axios.post(`${BASE}/user/cancelBooking`, d, { headers: getHeaders() })
export const genOrderId = (d) => axios.post(`${BASE}/user/genOrderId`, d, { headers: getHeaders() })
export const verifyPayment = (d) => axios.post(`${BASE}/user/verifyPayment`, d, { headers: getHeaders() })
export const addFeedback = (d) => axios.post(`${BASE}/user/addFeedback`, d, { headers: getHeaders() })