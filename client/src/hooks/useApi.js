import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const call = useCallback(async (apiFunc, successMsg = null) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFunc()
      if (successMsg) toast.success(successMsg)
      return result
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error occurred'
      setError(msg)
      toast.error(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, call }
}
