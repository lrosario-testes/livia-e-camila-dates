import { useState, useCallback, useEffect } from 'react'
import { Experience, Review } from '../types'
import { supabase } from '../integrations/supabase/client'

function dbToExperience(row: any): Experience {
  return {
    id: row.id,
    type: row.type,
    comidaTipo: row.comida_tipo || undefined,
    restauranteTipo: row.restaurante_tipo || undefined,
    isDelivery: row.is_delivery ?? false,
    isCaranguejo: row.is_caranguejo ?? false,
    compraTipo: row.compra_tipo || undefined,
    produtoNome: row.produto_nome || undefined,
    nocinema: row.nocinema ?? false,
    name: row.name,
    date: row.date,
    dateUnknown: row.date_unknown ?? false,
    tags: row.tags || [],
    status: row.status,
    createdAt: row.created_at,
  }
}

function dbToReview(row: any): Review {
  return {
    id: row.id,
    experienceId: row.experience_id,
    userName: row.user_name,
    ratings: row.ratings as Record<string, number>,
    average: Number(row.average),
    comments: row.comments,
    tags: row.tags || [],
    createdAt: row.created_at,
  }
}

export function useStorage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [expRes, revRes] = await Promise.all([
        supabase.from('experiences').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      ])
      if (expRes.data) setExperiences(expRes.data.map(dbToExperience))
      if (revRes.data) setReviews(revRes.data.map(dbToReview))
      setLoading(false)
    }
    load()
  }, [])

  const saveExperience = useCallback(async (exp: Experience) => {
    const { error } = await supabase.from('experiences').insert({
      id: exp.id,
      type: exp.type,
      comida_tipo: exp.comidaTipo || null,
      restaurante_tipo: exp.restauranteTipo || null,
      is_delivery: exp.isDelivery ?? false,
      is_caranguejo: exp.isCaranguejo ?? false,
      compra_tipo: exp.compraTipo || null,
      produto_nome: exp.produtoNome || null,
      nocinema: exp.nocinema ?? false,
      name: exp.name,
      date: exp.dateUnknown ? null : exp.date,
      date_unknown: exp.dateUnknown ?? false,
      tags: exp.tags,
      status: exp.status,
      created_at: exp.createdAt,
    })
    if (!error) {
      setExperiences(prev => [exp, ...prev])
    }
  }, [])

  const updateExperience = useCallback(async (id: string, patch: Partial<Experience>) => {
    const dbPatch: any = {}
    if (patch.status !== undefined) dbPatch.status = patch.status
    if (patch.name !== undefined) dbPatch.name = patch.name
    if (patch.tags !== undefined) dbPatch.tags = patch.tags

    await supabase.from('experiences').update(dbPatch).eq('id', id)
    setExperiences(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))
  }, [])

  const deleteExperience = useCallback(async (id: string) => {
    await supabase.from('experiences').delete().eq('id', id)
    setExperiences(prev => prev.filter(e => e.id !== id))
    setReviews(prev => prev.filter(r => r.experienceId !== id))
  }, [])

  const saveReview = useCallback(async (review: Review) => {
    const { error } = await supabase.from('reviews').insert({
      id: review.id,
      experience_id: review.experienceId,
      user_name: review.userName,
      ratings: review.ratings,
      average: review.average,
      comments: review.comments,
      tags: review.tags,
      created_at: review.createdAt,
    })

    if (!error) {
      setReviews(prev => {
        const updated = [review, ...prev]
        const expReviews = updated.filter(r => r.experienceId === review.experienceId)
        const users = new Set(expReviews.map(r => r.userName))
        if (users.has('livia') && users.has('camila')) {
          supabase.from('experiences').update({ status: 'avaliada' }).eq('id', review.experienceId)
          setExperiences(prevExp =>
            prevExp.map(e =>
              e.id === review.experienceId ? { ...e, status: 'avaliada' as const } : e
            )
          )
        }
        return updated
      })
    }
  }, [])

  const deleteReview = useCallback(async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
  }, [])

  return {
    experiences,
    reviews,
    loading,
    saveExperience,
    updateExperience,
    deleteExperience,
    saveReview,
    deleteReview,
  }
}
