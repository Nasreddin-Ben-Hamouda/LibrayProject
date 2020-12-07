<?php

namespace App\Controller;

use App\Entity\Book;
use App\Entity\Loan;
use App\Entity\Media;
use App\Entity\User;
use App\Form\BookFormType;
use Doctrine\ORM\EntityManagerInterface;
use Hashids\Hashids;
use phpDocumentor\Reflection\File;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class LibrarianController extends AbstractController
{
    private $manager;
    private $hashids;
    private $filesystem;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager=$manager;
        $this->hashids=new Hashids('',5);
        $this->filesystem=new Filesystem();
    }
    /**
     * @Route("/librarian/dashboard", name="showLibrarianDashboard",methods={"GET"})
     */
    public function showDashboard()
    {
        $countOfBooks=count($this->manager->getRepository(Book::class)->findAll());
        $countOfLoans=count($this->manager->getRepository(Loan::class)->findAll());
        $users=$this->manager->getRepository(User::class)->findAll();
        $countOfStudent=count($this->manager->getRepository(User::class)->findUsersByRole('ROLE_STUDENT'));
        $countOfLateBooks=count($this->manager->getRepository(Book::class)->findLateBooks());
        $mostFiveBooks=$this->manager->getRepository(Book::class)->mostFiveBooks();
        $mostFiveStudent=$this->manager->getRepository(User::class)->mostFiveStudents();


        return $this->render('librarian/dashboard.html.twig',
            [
                'countOfBooks'=>$countOfBooks,
                'countOfLoans'=>$countOfLoans,
                'countOfStudent'=>$countOfStudent,
                'countOfLateBooks'=>$countOfLateBooks,
                'mostFiveBooks'=>$mostFiveBooks,
                'mostFiveStudent'=>$mostFiveStudent
            ]);
    }
    /**
     * @Route("/librarian/profile", name="showLibrarianProfile",methods={"GET"})
     */
    public function showProfile()
    {
        return $this->render('librarian/profile.html.twig',[]);
    }
    /**
     * @Route("/librarian/loans/{bookId}", name="showLoans",methods={"GET"},defaults={"bookId"=null})
     */
    public function showLoans($bookId=null)
    {
        $loans=null;
        if($bookId!==null){
            $book=$this->manager->getRepository(Book::class)->find($this->hashids->decodeHex($bookId));
            if($book) {
                $loans =$book->getLoans();
            }else{
                $this->addFlash('warning','Livre innéxistant');
            }
        }else{
            $loans=$this->manager->getRepository(Loan::class)->findAll();
        }

        return $this->render('librarian/loans.html.twig',['loans'=>$loans]);
    }
    /**
     * @Route("/librarian/lateBooks", name="showLateBooks",methods={"GET"})
     */
    public function showLateBooks()
    {
        return $this->render('librarian/lateBooks.html.twig',[]);
    }
    /**
     * @Route("/librarian/books", name="showBooks")
     */
    public function showBooks(Request $request,ValidatorInterface $validator)
    {
        $book = new Book();
        $form = $this->createForm(BookFormType::class, $book);
        $form->handleRequest($request);
        $books=$this->manager->getRepository(Book::class)->findAll();
        if ($form->isSubmitted()) {
                if( !$form->isValid()){
                    $errors=$validator->validate($form);
                    foreach ($errors as $error){
                        $this->addFlash('error',$error->getMessage());
                    }
                    $form->clearErrors(true);

                }else {
                        $uploadedFiles = $form->get('picture')->getData();
                        if($form->get('id')->getData()){
                            $oldBook=$this->manager->getRepository(Book::class)->find($this->hashids->decodeHex($form->get('id')->getData()));
                            if ($uploadedFiles) {
                                foreach ($oldBook->getMedias() as $media){
                                    $this->filesystem->remove($this->getParameter('storage').'/images/book/'.$media->getPath());
                                    $this->manager->remove($media);
                                }
                                foreach ($uploadedFiles as $uploadedFile) {
                                    $newFileName = base64_encode(random_bytes(5)). '-' . time() . '.' . $uploadedFile->guessExtension();
                                    $fullImagePath = $this->getParameter('storage') . '/images/book/';
                                    $uploadedFile->move(
                                        $fullImagePath,
                                        $newFileName
                                    );
                                    $media = new Media();
                                    $media->setBook($oldBook);
                                    $media->setPath($newFileName);
                                    $this->manager->persist($media);
                                }
                            }
                            $oldBook->setTitle($book->getTitle());
                            $oldBook->setReference($book->getReference());
                            $oldBook->setAuthor($book->getAuthor());
                            $oldBook->setCategory($book->getCategory());
                            $oldBook->setSubject($book->getSubject());
                            $this->addFlash('success','Livre modifié avec succès ');
                        }else{
                            $this->manager->persist($book);
                            if ($uploadedFiles) {
                                foreach ($uploadedFiles as $uploadedFile) {

                                    $newFileName = base64_encode(random_bytes(5)). '-' . time() . '.' . $uploadedFile->guessExtension();
                                    $fullImagePath = $this->getParameter('storage') . '/images/book/';
                                    $uploadedFile->move(
                                        $fullImagePath,
                                        $newFileName
                                    );
                                    $media = new Media();
                                    $media->setBook($book);
                                    $media->setPath($newFileName);
                                    $this->manager->persist($media);
                                }
                            }
                            $this->addFlash('success','Livre ajouté avec succès ');
                        }
                        $this->manager->flush();
                        return $this->redirectToRoute('showBooks');

                }
            }
        return $this->render('librarian/books.html.twig',
            [
            'bookForm' => $form->createView(),
            'books'=>$books
            ]);
    }

    /**
     * @Route("/librarian/books/{id}/delete", name="handleDeleteBook",methods={"GET"})
     */
    public function handleDeleteBook($id){
        $book=$this->manager->getRepository(Book::class)->find($this->hashids->decodeHex($id));
        if($book){
            foreach ($book->getMedias() as $media){
                    $this->filesystem->remove($this->getParameter('storage').'/images/book/'.$media->getPath());
                    $this->manager->remove($media);
            }
            $this->manager->remove($book);
            $this->manager->flush();
            $this->addFlash('success','Livre supprimé avec succès');

        }else{
            $this->addFlash('error','Livre inéxistant');
        }
        return $this->redirectToRoute('showBooks');
    }

    /**
     * @Route("/librarian/books/{id}/changeStatus", name="handleChangeBookStatus",methods={"GET"})
     */
    public function handleChangeBookStatus($id){
        $book=$this->manager->getRepository(Book::class)->find($this->hashids->decodeHex($id));
        if($book){
            $loansNotReturned=$book->getLoans()->filter(function (Loan $loan){
                return $loan->getReturnedAt()==null;
            });
            foreach ($loansNotReturned as $loan){
                $loan->setReturnedAt(new \DateTime());
            }
            $book->setStatus(0);
            $this->manager->flush();
            $this->addFlash('success','Status modifié avec succès');

        }else{
            $this->addFlash('error','Livre inéxistant');
        }
        return $this->redirectToRoute('showBooks');
    }
    /**
     * @Route("/librarian/loans/{id}/delete", name="handleDeleteLoan",methods={"GET"})
     */
    public function handleDeleteLoan($id){
        $loan=$this->manager->getRepository(Loan::class)->find($this->hashids->decodeHex($id));
        if($loan){
            $this->manager->remove($loan);
            $this->manager->flush();
            $this->addFlash('success','Emprunt supprimé avec succès');

        }else{
            $this->addFlash('error','Emprunt inéxistant');
        }
        return $this->redirectToRoute('showLoans');
    }
    /**
     * @Route("/librarian/loans/{id}/changeLoanStatus", name="handleChangeLoanStatus",methods={"GET"})
     */
    public function handleChangeLoanStatus($id){
        $loan=$this->manager->getRepository(Loan::class)->find($this->hashids->decodeHex($id));
        if($loan){
            $loan->setReturnedAt(new \DateTime());
            $this->manager->flush();
            $this->addFlash('success','Status modifié avec succès');

        }else{
            $this->addFlash('error','Emprunt inéxistant');
        }
        return $this->redirectToRoute('showLoans');
    }

}
