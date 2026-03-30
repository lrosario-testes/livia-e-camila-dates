import { useState, useCallback } from 'react'
import { Experience, Review } from '../types'
import { SEED_EXPERIENCES, SEED_REVIEWS } from '../data/seed'

const KEY_EXP = 'lc_experiences'
const KEY_REV = 'lc_reviews'

function load<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
    // First time: seed data
    localStorage.setItem(key, JSON.stringify(seed))
    return seed
  } catch { return seed }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function useStorage() {
  const [experiences, setExperiences] = useState<Experience[]>(() => load<Experience>(KEY_EXP, SEED_EXPERIENCES as Experience[]))
  const [reviews, setReviews] = useState<Review[]>(() => load<Review>(KEY_REV, SEED_REVIEWS as Review[]))

  const saveExperience = useCallback((exp: Experience) => {
    setExperiences(prev => {
      const updated = [...prev, exp]
      save(KEY_EXP, updated)
      return updated
    })
  }, [])

  const updateExperience = useCallback((id: string, patch: Partial<Experience>) => {
    setExperiences(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...patch } : e)
      save(KEY_EXP, updated)
      return updated
    })
  }, [])

  const deleteExperience = useCallback((id: string) => {
    setExperiences(prev => {
      const updated = prev.filter(e => e.id !== id)
      save(KEY_EXP, updated)
      return updated
    })
    setReviews(prev => {
      const updated = prev.filter(r => r.experienceId !== id)
      save(KEY_REV, updated)
      return updated
    })
  }, [])

  const saveReview = useCallback((review: Review) => {
    setReviews(prev => {
      const updated = [...prev, review]
      save(KEY_REV, updated)

      // Check if both reviewed → update status
      const expReviews = updated.filter(r => r.experienceId === review.experienceId)
      const users = new Set(expReviews.map(r => r.userName))
      if (users.has('livia') && users.has('camila')) {
        setExperiences(prevExp => {
          const updatedExp = prevExp.map(e =>
            e.id === review.experienceId ? { ...e, status: 'avaliada' as const } : e
          )
          save(KEY_EXP, updatedExp)
          return updatedExp
        })
      }

      return updated
    })
  }, [])

  const deleteReview = useCallback((id: string) => {
    setReviews(prev => {
      const updated = prev.filter(r => r.id !== id)
      save(KEY_REV, updated)
      return updated
    })
  }, [])

  return {
    experiences,
    reviews,
    saveExperience,
    updateExperience,
    deleteExperience,
    saveReview,
    deleteReview,
  }
}
