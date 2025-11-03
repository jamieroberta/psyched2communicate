'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Announcement, urlFor, isImage, isPDF, isWord, isFile } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import MediaDisplay from '@/components/MediaDisplay'

interface AnnouncementModalProps {
  announcement: Announcement | null
  isOpen: boolean
  onClose: () => void
}

export default function AnnouncementModal({ announcement, isOpen, onClose }: AnnouncementModalProps) {
  if (!announcement) return null

  const publishedDate = new Date(announcement.publishedAt)
  const isExpired = announcement.expiresAt ? new Date(announcement.expiresAt) < new Date() : false

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      normal: 'bg-gray-100 text-gray-800 border-gray-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return colors[priority as keyof typeof colors] || colors.normal
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      general: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      policy: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      ),
      training: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.75 2.524z" />
        </svg>
      ),
      event: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      system: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      emergency: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    }
    return icons[category as keyof typeof icons] || icons.general
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <Dialog.Title as="h3" className="text-2xl font-semibold text-gray-900">
                    {announcement.title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Announcement Image/Media */}
                {announcement.media && announcement.media.length > 0 && (
                  <div className="relative">
                    {isImage(announcement.media) ? (
                      <div className="relative h-64 w-full cursor-pointer group">
                        <a
                          href={urlFor(announcement.media[0]).width(1200).height(800).url()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative h-full w-full"
                        >
                          <MediaDisplay
                            media={announcement.media}
                            width={800}
                            height={400}
                            className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                            showDownloadLink={false}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-25">
                            <div className="bg-white bg-opacity-90 rounded-full p-3">
                              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <MediaDisplay
                          media={announcement.media}
                          width={600}
                          height={400}
                          className="max-w-full"
                          showDownloadLink={true}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Status and Category Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(announcement.priority)}`}>
                      {getCategoryIcon(announcement.category)}
                      {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                    </span>
                    
                    {announcement.priority !== 'normal' && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                      </span>
                    )}
                    
                    {announcement.isPinned && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        📌 Pinned
                      </span>
                    )}
                    
                    {announcement.region ? (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {announcement.region.name}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600 border border-blue-200">
                        All Regions
                      </span>
                    )}
                    
                    {isExpired && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        Expired
                      </span>
                    )}
                  </div>

                  {/* Show content only if no file media */}
                  {!(announcement.media && announcement.media.length > 0 && isFile(announcement.media)) && (
                    <>
                      {/* Announcement Excerpt */}
                      {announcement.excerpt && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">Summary</h4>
                          <p className="text-gray-700 leading-relaxed text-base">{announcement.excerpt}</p>
                        </div>
                      )}

                      {/* Announcement Content */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Details</h4>
                        <div className="prose prose-gray max-w-none">
                          <PortableText value={announcement.content} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Show compact content for file announcements */}
                  {announcement.media && announcement.media.length > 0 && isFile(announcement.media) && announcement.excerpt && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">About this Document</h4>
                      <p className="text-gray-700 leading-relaxed text-base">{announcement.excerpt}</p>
                    </div>
                  )}

                  {/* Announcement Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    {/* Published Date */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Published</h4>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="font-medium text-gray-900">{formatDate(publishedDate)}</div>
                          <div className="text-sm text-gray-600">
                            {publishedDate.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expiration Date */}
                    {announcement.expiresAt && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Expires</h4>
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatDate(new Date(announcement.expiresAt))}
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(announcement.expiresAt).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-6 bg-gray-50 border-t">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
